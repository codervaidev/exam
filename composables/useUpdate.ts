const state = reactive({
  isOpen: false,
});

export default function useUpdate() {
  const { isOpen } = toRefs(state);

  const onOpen = () => {
    state.isOpen = true;
  };

  const user = useUser();
  
  const onClose = () => {
    if (user.value?.tshirt && user.value?.address) {
      state.isOpen = false;
    } else {
      state.isOpen = true;
    }
  };

  return {
    isOpen,
    onOpen,
    onClose,
  };
}
