import React,{useState} from 'react'
import SignatureCanvas from 'react-signature-canvas'
import axios from 'axios'
import '../../App.css'

// use this css. THIS IS A MUST
// .sigCanvas{
//   width: 100%;
//   height: 100%;
// }


export default function Signature() {
  const [sign,setSign] = useState()
  const clear = () => sign.clear()

  const handleSave =async () => {

    const blob = dataURLtoBlob(sign.toDataURL('image/png'))
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
    clear()
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
    <div className='p-5'>
    <div className='w-auto h-auto border border-red-900'>
        <SignatureCanvas canvasProps={{ className:"sigCanvas"}}  ref={(data) => setSign(data)} />
    </div>

    <div className=" mt-4 gap-3 flex justify-end">
    

            <button
              onClick={clear}
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
  )
}
