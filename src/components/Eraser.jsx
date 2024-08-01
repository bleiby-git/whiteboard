import React from "react";
import PhonelinkErase from '@mui/icons-material/PhonelinkErase';

export function Eraser({handleEraserClick}) {
     return (
        <div id="eraser">
            <PhonelinkErase onClick={(e) => handleEraserClick(e)} />
        </div>
    );
}  