import { GameObjects, Scene } from "phaser";

export default class Checkbox extends GameObjects.Container {
  DOMID: string;
  checkboxElement: GameObjects.DOMElement;
  label: GameObjects.Text;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    DOMID: string,
    onChange: (isChecked: boolean) => void,
    label: string = "",
    initialValue: boolean = false
  ) {
    super(scene, x, y);

    this.DOMID = DOMID;

    this.checkboxElement = new GameObjects.DOMElement(scene, -4, -2)
      .createFromHTML(`<input id="${DOMID}" type="checkbox" />`)
      .addListener("change");

    this.checkboxElement.setOrigin(0, 0);

    this.checkboxElement.on("change", (e: any) => {
      onChange(e.target.checked);
    });

    this.label = new GameObjects.Text(scene, 22, 0, label, {});

    this.add([this.checkboxElement, this.label]);
    this.setValue(initialValue);

    scene.add.existing(this);
  }

  getValue(): boolean | null {
    const element = this.checkboxElement.getChildByID(this.DOMID) as any;
    return element.checked || null;
  }

  setValue(value: boolean) {
    const element = this.checkboxElement.getChildByID(this.DOMID) as any;
    element.checked = value;
  }

  setId(id: string) {
    const element = this.checkboxElement.getChildByID(this.DOMID) as any;
    this.DOMID = id;
    element.id = id;
  }
}
