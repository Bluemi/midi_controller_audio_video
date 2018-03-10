class ColorTools {
    static mergeColor(oldHex, currentHex) {
        let currentColor = new c_c.Color({hex:currentHex});
        if (oldHex === "#333")
            return currentColor.hex();

        let oldColor = new c_c.Color({hex:oldHex});
        let newColor = new c_c.Color({mix:[oldColor,currentColor]});

        return newColor.hex();
    }
}