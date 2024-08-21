const state = reactive({
  isOpen: false,
  initialQuestion: null,
});

export default function useExam() {
  const { isOpen, initialQuestion } = toRefs(state);

  const onEdit = (question) => {
    state.initialQuestion = question;
    state.isOpen = true;
  };

  const onOpen = () => {
    state.isOpen = true;
  };

  const onClose = () => {
    state.isOpen = false;
    state.initialQuestion = null;
  };

  return {
    initialQuestion,
    isOpen,
    onEdit,
    onOpen,
    onClose,
  };
}
