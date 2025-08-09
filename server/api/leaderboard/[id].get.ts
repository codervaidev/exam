import { defineEventHandler, createError } from 'h3'
import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.params?.id

    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User id is required'
      })
    }

    // Fetch basic user info
    const userResult = await query<{
      id: string
      name: string
      institute: string
    }>(
      `SELECT id, name, institute 
       FROM free_exam_users 
       WHERE id = $1`,
      [userId]
    )

    if (!userResult.success) {
      throw createError({ statusCode: 500, statusMessage: 'Database error while fetching user' })
    }

    const user = userResult.data?.[0]
    if (!user) {
      throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }

    // Count exams that have started (completed exams in the sense of leaderboard denominator)
    const completedExamsCountResult = await query<{ count: number }>(
      `SELECT COUNT(*)::int as count 
       FROM free_exam_exams 
       WHERE start_time <= NOW()`
    )

    if (!completedExamsCountResult.success) {
      throw createError({ statusCode: 500, statusMessage: 'Database error while counting completed exams' })
    }

    const completedExamsCount = completedExamsCountResult.data?.[0]?.count || 0

    // Fetch per-exam results for the user
    const resultsResult = await query<{
      exam_id: string
      title: string
      exam_total_marks: number
      exam_duration: number
      start_time: string
      end_time: string
      submission_id: string
      marks: number
      correct: number
      incorrect: number
      skipped: number
      submission_duration: number
      submitted_at: string | null
      status: string
    }>(
      `SELECT 
        e.id as exam_id,
        e.title,
        e.total_marks as exam_total_marks,
        e.duration as exam_duration,
        e.start_time,
        e.end_time,
        s.id as submission_id,
        s.marks,
        s.correct,
        s.incorrect,
        s.skipped,
        s.duration as submission_duration,
        s.submitted_at,
        s.status
      FROM free_exam_submissions s
      JOIN free_exam_exams e ON s.exam_id = e.id
      WHERE s.user_id = $1
        AND s.status = 'submitted'
        AND s.duration >= 120000
      ORDER BY e.start_time ASC`,
      [userId]
    )

    if (!resultsResult.success) {
      throw createError({ statusCode: 500, statusMessage: 'Database error while fetching user results' })
    }

    const results = (resultsResult.data || []).map((r) => ({
      examId: r.exam_id,
      title: r.title,
      totalMarks: r.exam_total_marks,
      examDuration: r.exam_duration,
      startTime: r.start_time,
      endTime: r.end_time,
      submissionId: r.submission_id,
      marks: r.marks,
      correct: r.correct,
      incorrect: r.incorrect,
      skipped: r.skipped,
      duration: r.submission_duration,
      submittedAt: r.submitted_at,
      status: r.status,
      percentage: r.exam_total_marks > 0 ? Math.round((r.marks / r.exam_total_marks) * 100) : 0
    }))

    const totals = results.reduce(
      (acc, r) => {
        acc.totalExamsAttempted += 1
        acc.totalMarksObtained += r.marks
        acc.totalDuration += r.duration || 0
        return acc
      },
      { totalExamsAttempted: 0, totalMarksObtained: 0, totalDuration: 0 }
    )

    const averageMarks = completedExamsCount > 0
      ? Math.round((totals.totalMarksObtained / completedExamsCount) * 100) / 100
      : 0

    const averageDuration = totals.totalExamsAttempted > 0
      ? Math.round(totals.totalDuration / totals.totalExamsAttempted)
      : 0

    return {
      user,
      overview: {
        completedExamsCount,
        totalExamsAttempted: totals.totalExamsAttempted,
        totalMarksObtained: totals.totalMarksObtained,
        averageMarks,
        totalDuration: totals.totalDuration,
        averageDuration
      },
      results
    }
  } catch (error) {
    console.error('Error in leaderboard user overview API:', error)
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    throw createError({ statusCode: 500, statusMessage: 'Internal server error while fetching user overview' })
  }
})


