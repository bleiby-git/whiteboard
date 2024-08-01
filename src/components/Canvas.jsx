import React from "react";
import { useState, useEffect, useRef } from 'react';
import { EventDto } from '../data/EventDto';

export default function Canvas({ color, isErasing, lineWidth, clearAll, resetClearAll }) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // isConnected is a flag that indicates that we are connected to the whiteboard service
  const [isConnected, setIsConnected] = useState(false);

  // isSender is a flag that indicates that this application instance is the originator of the drawing event.
  // This way we can avoid responding to drawing  event messages from the whiteboard service
  const [isSender, setIsSender] = useState(false);

  const webSocket = useRef(null);

  const prepareCanvas = () => {
    console.log("prepareCanvas enter");

    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext("2d")
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = lineWidth;
    contextRef.current = context;

    console.log("prepareCanvas exit");
  };

  // When component is intially rendered, prepare the canvas
  useEffect(() => {
    prepareCanvas();
  }, []);

  // When user clicks the clearAll icon in the toolbar, clear the canvas 
  useEffect(() => {
    if (clearAll) {
      console.log("clearRect");
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      resetClearAll();
    }
  }, [clearAll]);

  // Open web socket, register open close handlers
  useEffect(() => {
    if(isConnected)
      return;

    console.log('Opening WebSocket');
    webSocket.current = new WebSocket('ws://localhost:8080/whiteboard');

    //  socket open handler 
    webSocket.current.onopen = (event) => {
      console.log('Open:', event);
    }
    // socket close handler
    webSocket.current.onclose = (event) => {
      console.log('Close:', event);
    }

    setIsConnected(true);
      
    return () => {
        console.log('Closing WebSocket');
  //      webSocket.current.close();   // **** FIX THIS ***
    }
  }, [isConnected]);

  // Register recieved socket message handler
  useEffect(() => {
    console.log('Register Message handler start');

    webSocket.current.onmessage = (event) => {

      // if we are the sender of the message, reset isSender flag and bail out. 
      // We dont respond to messages that we (this app instance) sent 
      if(isSender) {
        setIsSender(false);
        return;
      }
  
      const eventDto = JSON.parse(event.data);
  
      if (eventDto.operation === 'startDrawing')
      {
        startDrawing(eventDto.xOffset, eventDto.yOffset, eventDto.lineWidth, eventDto.isErasing);
      }
      else if (eventDto.operation === 'finishDrawing')
      {
        finishDrawing();
      }
      else if (eventDto.operation === 'draw')
      {
        draw(eventDto.xOffset, eventDto.yOffset, eventDto.color, eventDto.lineWidth, eventDto.isErasing);
      }
    }
  }, []);

  // Register socket message sender
  const sendMessage = (message) => {
    webSocket.current.send(message);

    setIsSender(true);
  };

  // Mouse event handlers
  function handleMouseMove(e) {
    if (!isDrawing) {
      return;
    }
    console.log('move');

    const { offsetX, offsetY } = e.nativeEvent; // need to get these through nativeEvent

    draw(offsetX, offsetY, color, lineWidth, isErasing);

    const message = JSON.stringify(new EventDto('draw', offsetX, offsetY, color, lineWidth, isErasing));
    sendMessage(message);

    e.nativeEvent.preventDefault();
  };

  function handleMouseDown(e) {
    console.log('mouseDown');

    const { offsetX, offsetY } = e.nativeEvent; // need to get these through nativeEvent

    startDrawing(offsetX, offsetY, lineWidth, isErasing);
    setIsDrawing(true);

    const message = JSON.stringify(new EventDto('startDrawing', offsetX, offsetY, null, lineWidth, isErasing));
    sendMessage(message);
  };

  function handleMouseUp() {
    finishDrawing();
    setIsDrawing(false);
  };

  function handleMouseOut() {
    console.log('mouseOut');
    setIsDrawing(false);
  }

  // Drawing functions
  function startDrawing(offsetX, offsetY, lineWidth, isErasing) {
    if (isErasing) {
      contextRef.current.globalCompositeOperation = 'destination-out';
      contextRef.current.lineWidth = lineWidth * 4;
    }
    else {
      contextRef.current.globalCompositeOperation = 'source-over';
      contextRef.current.lineWidth = lineWidth;
    }

    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  }

  function draw(offsetX, offsetY, color, lineWidth, isErasing) {
    if (isErasing) {
      contextRef.current.strokeStyle = color;
      /*
        We need to change the center of the eraser to a certain offset from the default (offsetX, offsetY) 
        which is the cross hairs of the mouse cursor ... upper left corner. 
        Ideally the eraser effects dimensions should be based on the dimensions of the eraser image.
        Havent found a straight forward way to get the image dimensions when the image is referenced in the .css file yet. 
        This is kind of a hack but will do for now.
      */
      contextRef.current.lineTo(offsetX + (lineWidth * 2) + 8, offsetY + (lineWidth * 2) + 5);
      contextRef.current.stroke();
    }
    else {

      contextRef.current.strokeStyle = color;
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    }

  }

  // new multi user code
  function finishDrawing() {
    contextRef.current.closePath();
  };


  return (
    <div>
      <canvas ref={canvasRef}

        className={isErasing ? "canvas-cursor" : ""}

        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseOut} />
    </div>
  )
}
