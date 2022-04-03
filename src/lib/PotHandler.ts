import TableConnection from "./TableConnection";
import { Color } from "../model/Color";
import Package from "../model/Package";
import { Pot } from "../model/Pot";


type SelectCallback = (pot: Pot) => void

export class PotHandler {

    pots: Pot[]
    private waitOnSelect: {
        isWaiting: boolean,
        onResolve?: SelectCallback
    } = {
            isWaiting: false,
            onResolve: undefined
        }
    private tableConnection: TableConnection

    constructor(
        tableConnection: TableConnection
    ) {
        this.tableConnection = tableConnection
        this.pots = [
            new Pot(0, Color.default(), this.onPotSelect),
            new Pot(1, Color.default(), this.onPotSelect),
            new Pot(2, Color.default(), this.onPotSelect),
            new Pot(3, Color.default(), this.onPotSelect),
            new Pot(4, Color.default(), this.onPotSelect),
            new Pot(5, Color.default(), this.onPotSelect),
            new Pot(6, Color.default(), this.onPotSelect),
            new Pot(7, Color.default(), this.onPotSelect),
            new Pot(8, Color.default(), this.onPotSelect),
            new Pot(9, Color.default(), this.onPotSelect),

            new Pot(10, Color.default(), this.onPotSelect),
            new Pot(11, Color.default(), this.onPotSelect),
            new Pot(12, Color.default(), this.onPotSelect),
            new Pot(13, Color.default(), this.onPotSelect),
            new Pot(14, Color.default(), this.onPotSelect),
            new Pot(15, Color.default(), this.onPotSelect),
            new Pot(16, Color.default(), this.onPotSelect),
            new Pot(17, Color.default(), this.onPotSelect),
            new Pot(18, Color.default(), this.onPotSelect),
            new Pot(19, Color.default(), this.onPotSelect)
        ]
    }

    private lastSendColors: number = Date.now()

    changeColorOfSelected = (color: Color) => {
        const selectedPots = this.pots.filter(pot => pot.is_selected)

        const isNoPotSelected = selectedPots.length === 0
        if (isNoPotSelected) return

        selectedPots.forEach(pot => pot.color = color)

        const now = Date.now()
        if (now - this.lastSendColors > 100 / 30) {
            const package_ = Package.setPotColors(selectedPots)
            this.tableConnection.send(package_.pack())
            this.lastSendColors = now
        }
    }

    private onPotSelect = (pot: Pot): boolean => {
        if (!this.waitOnSelect.isWaiting) return true
        this.resolveSelect(pot)
        return false
    }

    private resolveSelect = (pot: Pot) => {
        this.waitOnSelect.onResolve!(pot)
        this.waitOnSelect = {
            isWaiting: false
        }
    }

    waitForPotSelect = (callback: SelectCallback): (() => void) => {
        return this.setToWaitOnSelect(callback)
    }

    private setToWaitOnSelect = (callback: SelectCallback): (() => void) => {
        this.waitOnSelect = {
            isWaiting: true,
            onResolve: callback
        }

        return () => {
            this.waitOnSelect = {
                isWaiting: false
            }
        }
    }

    unselectAll = () => {
        this.pots.forEach(pot => pot.unselect())
    }

}