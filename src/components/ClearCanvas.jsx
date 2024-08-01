import React from "react";
import ClearAll from '@mui/icons-material/ClearAll';

export function ClearCanvas({handleClearAllClick}) {
     return (
        <div id="clearall">
            <ClearAll onClick={(e) => handleClearAllClick(e)} />
        </div>
    );
}  