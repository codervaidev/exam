export const editorOptions = {
  modules: {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],

      [{ size: ["small", false, "large", "huge"] }],

      [{ color: [] }, { background: [] }],
      [{ align: [] }],

      ["formula", "link", "image"],
    ],
    // formula: true,
  },
  placeholder: "Insert your text here",
  theme: "snow",
};
