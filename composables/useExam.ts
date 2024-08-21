const state = reactive({
  isOpen: false,
  initialExam: {},
});

export default function useExam() {
  const { isOpen, initialExam } = toRefs(state);

  const onEdit = (exam) => {
    state.initialExam = exam;
    state.isOpen = true;
  };

  const onOpen = () => {
    state.isOpen = true;
  };

  const onClose = () => {
    state.isOpen = false;
  };

  return {
    initialExam,
    isOpen,
    onEdit,
    onOpen,
    onClose,
  };
}
