const state = reactive({
  isOpen: false,
  initialExam: {},
  isEditOpen: false,
  editExam: {},
});

export default function useExam() {
  const { isOpen, initialExam, isEditOpen, editExam } = toRefs(state);

  const onEdit = (exam) => {
    state.editExam = exam;
    state.isEditOpen = true;
  };

  const onOpen = () => {
    state.isOpen = true;
  };

  const onClose = () => {
    state.isOpen = false;
  };

  const onEditClose = () => {
    state.isEditOpen = false;
  };

  const onEditUpdated = () => {
    state.isEditOpen = false;
    // Refresh the exams data
    refreshNuxtData('admin-exams');
  };

  return {
    initialExam,
    isOpen,
    editExam,
    isEditOpen,
    onEdit,
    onOpen,
    onClose,
    onEditClose,
    onEditUpdated,
  };
}
