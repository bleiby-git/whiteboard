export class EventDto {
    constructor(operation, xOffset, yOffset, color, lineWidth, isErasing){
        this.operation = operation;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.color = color;
        this.lineWidth = lineWidth;
        this.isErasing = isErasing;
    }
}