import { GameObjects, Scene } from "phaser";

export default class NumberInput extends GameObjects.Container {
  DOMID: string;
  inputElement: GameObjects.DOMElement;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    DOMID: string,
    initialValue = 0
  ) {
    super(scene, x, y);

    this.DOMID = DOMID;

    this.inputElement = new GameObjects.DOMElement(scene, 0, 0)
      .createFromHTML(
        `<input id="${DOMID}" type="number" min="0" style="width: 75px;" value="${initialValue}" />`
      )
      .addListener("change");

    this.inputElement.on("change", (e: any) => {});

    this.add(this.inputElement);

    scene.add.existing(this);
  }

  getValue(): number | null {
    const element = this.inputElement.getChildByID(this.DOMID) as any;
    return element.value ? parseInt(element.value) : null;
  }

  setValue(value: number) {
    const element = this.inputElement.getChildByID(this.DOMID) as any;
    element.value = value.toString();
  }
}
