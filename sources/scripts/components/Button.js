class Button {
  constructor(_id, _onClickCallback) {
    this.el = document.getElementById(_id);
    
    this.onClick(_onClickCallback || null);
    this.onMouseOver();
    console.log(this.el);
  }

  onClick(callback) {
    this.el.addEventListener("click", callback);
  }

  onMouseOver() {
    this.el.addEventListener("mouseover", () => {
      console.log("hey there overrrr");
    });
  }
}