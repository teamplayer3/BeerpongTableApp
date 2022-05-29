import { observable, runInAction } from "mobx";
import { Byte, numberToByte } from "../util/Utils"

import { Color } from "./Color";

type OnSelectCallback = (pot: Pot) => boolean

export class Pot {
    id: Byte
    observer_color = observable.box<Color>()
    observer_selected = observable.box<boolean>(false)

    private onSelect: OnSelectCallback

    constructor(id: Byte, color: Color, onSelect: OnSelectCallback) {
        this.id = id
        this.observer_color.set(color)
        this.onSelect = onSelect
    }

    get color() {
        return this.observer_color.get()
    }

    set color(color: Color) {
        runInAction(() => this.observer_color.set(color))
    }

    select = () => {
        const selectable = this.onSelect(this)
        if (selectable) runInAction(() => this.observer_selected.set(true))
    }

    get is_selected() {
        return this.observer_selected.get()
    }

    toggleSelect = () => {
        const selectable = this.onSelect(this)
        if (selectable) runInAction(() => this.observer_selected.set(!this.observer_selected.get()))
    }

    unselect = () => {
        runInAction(() => this.observer_selected.set(false))
    }



    serialize = () => {
        const colorSerialized = this.color.serialize()
        const bytes = new Uint8Array(1 + colorSerialized.length)

        bytes.set([numberToByte(this.id)], 0)
        bytes.set(colorSerialized, 1)

        return bytes
    }

}