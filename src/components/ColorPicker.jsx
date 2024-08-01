import React from "react";
import ColorizeIcon from '@mui/icons-material/Colorize';

export function ColorPicker({ color, handleColorChange }) {
    return (
        <div id="color-picker">
            <input type="color" value={color} onChange={(e) => handleColorChange(e)} id="color-input" />
            <label class="color-select" for="color-input">
                <ColorizeIcon fontSize='large' />
            </label>
        </div>
    );
}  