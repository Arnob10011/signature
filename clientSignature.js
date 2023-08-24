import React, { useRef, useState } from 'react';
import axios from 'axios';

const Signature = () => {
  // creating the whole canvas
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);

  const startDrawing = (context, event) => {
    context.beginPath();
    context.moveTo(event.clientX, event.clientY);
    setIsDrawing(true);
    setLastX(event.clientX);
    setLastY(event.clientY);
  };

  const draw = (context, event) => {
    if (!isDrawing) return;

    const currentX = event.clientX;
    const currentY = event.clientY;

    // Calculate distance between current and last points
    const distance = Math.sqrt(
      Math.pow(currentX - lastX, 2) + Math.pow(currentY - lastY, 2)
    );

    context.lineCap = 'round';
    context.lineJoin = 'round';

    // Draw intermediate points if the distance is larger
    if (distance > 1) {
      context.beginPath();
      context.moveTo(lastX, lastY);
      context.lineTo(currentX, currentY);
      context.stroke();
      setLastX(currentX);
      setLastY(currentY);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handlePointerDown = (event) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.lineWidth = 3; // Set the desired line width here

    startDrawing(context, event);
  };

  const handlePointerMove = (event) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    draw(context, event);
  };

  const handlePointerUp = () => {
    stopDrawing();
  };


  // other operations work

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave =async () => {
    console.log(canvasRef.current.toDataURL('image/png'))

    const blob = dataURLtoBlob(canvasRef.current.toDataURL('image/png'))
    const formData = new FormData()
    formData.append("signature", blob, 'signature.png')


    // Send the signature data to the server for processing/storage
    const res = await axios.post('http://localhost:3000/save-customer-signature', formData,{
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    console.log(res.data)
    // removes the signature from client side
    handleClearCanvas()
  };


  // will convert dataURL of image to blog so that we can append it on form data
  function dataURLtoBlob(dataURL) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }




  return (
    <div>

<div >
      <canvas
        ref={canvasRef}
        width={900} // Set canvas dimensions as needed
        height={400}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
    </div>



    <div className=" mt-4 gap-3 flex justify-end">
    

    <button
      onClick={handleClearCanvas}
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      Clear
    </button>

    
    <button
      onClick={handleSave}
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      save
    </button>
  </div>



    </div>


    

    
  );
};

export default Signature;
