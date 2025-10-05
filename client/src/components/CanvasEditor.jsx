import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";



function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], {type:mime});


}


function drawPolygon(ctx, x, y, radius, sides, color) {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = (2 * Math.PI * i) / sides - Math.PI / 2;
    const dx = x + radius * Math.cos(angle);
    const dy = y + radius * Math.sin(angle);
    if (i === 0) {
      ctx.moveTo(dx, dy);
    } else {
      ctx.lineTo(dx, dy);
    }
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}


const HANDLE_SIZE = 16;
let nextId = 1;


const getDefaultSize = (type, text, ctx) => {
  if (type === "rectangle") return { w: 120, h: 80 };
  if (type === "square" || type === "circle") return { w: 100, h: 100 };
  if (type === "oval") return { w: 120, h: 80 };
  if (type === "image") return { w: 200, h: 200 };
  if (type === "text") {
    ctx.font = "24px Arial";
    return { w: ctx.measureText(text).width, h: 32, fontSize: 24 };
  }
  return { w: 120, h: 80 };
};




const CanvasEditor = ({ initialData }) => {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const { id: designId } = useParams();
  const navigate = useNavigate();
  const [saveMessage, setSaveMessage] = useState("");
  const [designName, setDesignName] = useState("");
  const [selectedShape, setSelectedShape] = useState("rectangle");
  const [shapeColor, setShapeColor] = useState("#4f46e5");
  const [drawMode, setDrawMode] = useState(false);
  const [eraserMode, setEraserMode] = useState(false);
  const [eraserSize, setEraserSize] = useState(20);
  const [textColor, setTextColor] = useState("#111827");
  const [pencilColor, setPencilColor] = useState("#333");
  const [brushSize, setBrushSize] = useState(2);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [resizingHandle, setResizingHandle] = useState(null);
  const drawingPointsRef = useRef([]);




  const [history, setHistory] = useState([
    { elements: [], lines: [], title: "" },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [imageCache, setImageCache] = useState({});


  // Destructure current elements, lines, title from history to use in render & save
  const { elements, lines, title } = history[historyIndex];


  // Load initialData properly when component mounts or changes
 useEffect(() => {
  setHistory([
    {
      elements: initialData?.jsonData?.elements || [],
      lines: initialData?.jsonData?.lines || [],
      title: initialData?.title || "",
    },
  ]);
  setHistoryIndex(0);
  setDesignName(initialData?.title || "");
}, [initialData]);


  // Cache loaded images for drawn image elements
  useEffect(() => {
    elements.forEach((el) => {
      if (el.type === "image" && el.src && !imageCache[el.id]) {
        const img = new window.Image();
        img.src = el.src;
        img.onload = () => setImageCache((c) => ({ ...c, [el.id]: img }));
      }
    });
  }, [elements, imageCache]);


  // Draw all elements and lines on canvas on every change
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineWidth = 2;


    elements.forEach((el, idx) => {
      ctx.save();
      const w = el.w,
        h = el.h;
      const cx = el.x + w / 2;
      const cy = el.y + h / 2;
      ctx.translate(cx, cy);
      ctx.rotate(((el.rotation || 0) * Math.PI) / 180);
      ctx.translate(-cx, -cy);


      if (el.type === "image") {
        const img = imageCache[el.id];
        if (img) {
          ctx.drawImage(img, el.x, el.y, w, h);
          if (idx === selectedIdx) {
            ctx.strokeStyle = "#f59e42";
            ctx.lineWidth = 2;
            ctx.strokeRect(el.x - 2, el.y - 2, w + 4, h + 4);
            drawHandles(ctx, el.x, el.y, w, h);
          }
        }
      } 
      else if (el.type === "text") {
 ctx.font = `${el.fontSize || 24}px ${el.fontFamily || "Arial"}`;
 ctx.fillStyle = el.color;
 ctx.fillText(el.text, el.x, el.y + (el.fontSize || 24));
 const boxW = el.w;
 const boxH = el.h || (el.fontSize || 24) + 8;
 if (idx === selectedIdx) {
   ctx.strokeStyle = "#f59e42";
   ctx.strokeRect(el.x - 2, el.y - 2, boxW + 4, boxH + 4);
   drawHandles(ctx, el.x, el.y, boxW, boxH);
 }
}


       else {
        ctx.fillStyle = el.color;
        ctx.strokeStyle = el.color;
        switch (el.type) {
          case "rectangle":
          case "square":
            ctx.fillRect(el.x, el.y, w, h);
            break;
          case "circle":
            ctx.beginPath();
            ctx.arc(el.x + w / 2, el.y + h / 2, w / 2, 0, 2 * Math.PI);
            ctx.fill();
            break;
          case "oval":
            ctx.save();
            ctx.translate(el.x + w / 2, el.y + h / 2);
            ctx.scale(1.5, 1);
            ctx.beginPath();
            ctx.arc(0, 0, h / 2, 0, 2 * Math.PI);
            ctx.restore();
            ctx.fill();
            break;
          case "triangle":
            ctx.beginPath();
            ctx.moveTo(el.x, el.y + h);
            ctx.lineTo(el.x + w, el.y + h);
            ctx.lineTo(el.x + w / 2, el.y);
            ctx.closePath();
            ctx.fill();
            break;
          case "parallelogram":
            ctx.beginPath();
            ctx.moveTo(el.x + 20, el.y + h);
            ctx.lineTo(el.x + w + 20, el.y + h);
            ctx.lineTo(el.x + w, el.y);
            ctx.lineTo(el.x, el.y);
            ctx.closePath();
            ctx.fill();
            break;
          case "rhombus":
            ctx.beginPath();
            ctx.moveTo(el.x + w / 2, el.y);
            ctx.lineTo(el.x + w, el.y + h / 2);
            ctx.lineTo(el.x + w / 2, el.y + h);
            ctx.lineTo(el.x, el.y + h / 2);
            ctx.closePath();
            ctx.fill();
            break;
          case "trapezoid":
            ctx.beginPath();
            ctx.moveTo(el.x + 20, el.y + h);
            ctx.lineTo(el.x + w - 20, el.y + h);
            ctx.lineTo(el.x + w, el.y);
            ctx.lineTo(el.x, el.y);
            ctx.closePath();
            ctx.fill();
            break;
          case "kite":
            ctx.beginPath();
            ctx.moveTo(el.x + w / 2, el.y);
            ctx.lineTo(el.x + w, el.y + h / 2);
            ctx.lineTo(el.x + w / 2, el.y + h);
            ctx.lineTo(el.x, el.y + h / 2);
            ctx.closePath();
            ctx.fill();
            break;
          case "pentagon":
          case "hexagon":
          case "heptagon":
          case "octagon":
          case "nonagon":
          case "decagon":
            const sides = {
              pentagon: 5,
              hexagon: 6,
              heptagon: 7,
              octagon: 8,
              nonagon: 9,
              decagon: 10,
            }[el.type];
            drawPolygon(
              ctx,
              el.x + w / 2,
              el.y + h / 2,
              Math.min(w, h) / 2,
              sides,
              el.color
            );
            break;
          default:
            break;
        }
        if (idx === selectedIdx) {
          ctx.strokeStyle = "#f59e42";
          ctx.lineWidth = 2;
          ctx.strokeRect(el.x - 2, el.y - 2, w + 4, h + 4);
          drawHandles(ctx, el.x, el.y, w, h);
        }
      }
      ctx.restore();
    });


    lines.forEach((line) => {
      ctx.beginPath();
      ctx.strokeStyle = line.mode === "eraser" ? "rgba(0,0,0,1)" : line.color || "#333";
      ctx.lineWidth = line.size || 2;
      
      ctx.globalCompositeOperation =
        line.mode === "eraser" ? "destination-out" : "source-over";
      line.points.forEach(([x, y], i) => {
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.globalCompositeOperation = "source-over";
    });
  }, [elements, lines, imageCache, selectedIdx]);


  function drawHandles(ctx, x, y, w, h) {
    const handles = [
      [x - HANDLE_SIZE / 2, y - HANDLE_SIZE / 2],
      [x + w - HANDLE_SIZE / 2, y - HANDLE_SIZE / 2],
      [x - HANDLE_SIZE / 2, y + h - HANDLE_SIZE / 2],
      [x + w - HANDLE_SIZE / 2, y + h - HANDLE_SIZE / 2],
    ];
    handles.forEach(([hx, hy]) => {
      ctx.fillStyle = "#fff";
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.fillRect(hx, hy, HANDLE_SIZE, HANDLE_SIZE);
      ctx.strokeRect(hx, hy, HANDLE_SIZE, HANDLE_SIZE);
    });
  }


  const saveState = (newElements, newLines, newTitle = designName) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      elements: JSON.parse(JSON.stringify(newElements)),
      lines: JSON.parse(JSON.stringify(newLines)),
      title: newTitle,
    });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setDesignName(newTitle);
  };


  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSelectedIdx(null);
    }
  };


  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSelectedIdx(null);
    }
  };


  const getHandleAt = (el, mouseX, mouseY) => {
    const { w, h } = el;
    const handles = [
      [el.x - HANDLE_SIZE / 2, el.y - HANDLE_SIZE / 2],
      [el.x + w - HANDLE_SIZE / 2, el.y - HANDLE_SIZE / 2],
      [el.x - HANDLE_SIZE / 2, el.y + h - HANDLE_SIZE / 2],
      [el.x + w - HANDLE_SIZE / 2, el.y + h - HANDLE_SIZE / 2],
    ];
    for (let i = 0; i < handles.length; i++) {
      const [hx, hy] = handles[i];
      if (
        mouseX >= hx &&
        mouseX <= hx + HANDLE_SIZE &&
        mouseY >= hy &&
        mouseY <= hy + HANDLE_SIZE
      )
        return i;
    }
    return null;
  };


  const handleCanvasMouseDown = (e) => {
    if (!canvasRef.current) return;
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;
    let clicked = false;
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i];
      const handleIdx = getHandleAt(el, mouseX, mouseY);
      if (i === selectedIdx && handleIdx !== null) {
        setResizingHandle(handleIdx);
        clicked = true;
        break;
      }
      if (
        mouseX >= el.x &&
        mouseX <= el.x + el.w &&
        mouseY >= el.y &&
        mouseY <= el.y + el.h
      ) {
        setSelectedIdx(i);
        setDragOffset({ x: mouseX - el.x, y: mouseY - el.y });
        setIsDragging(true);
        clicked = true;
        break;
      }
    }
    if (!clicked) setSelectedIdx(null);


    if (drawMode || eraserMode) {
      setIsDrawing(true);
      drawingPointsRef.current = [[mouseX, mouseY]];
    }
  };


  const handleCanvasMouseMove = (e) => {
    if (!canvasRef.current) return;
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;


    if (resizingHandle !== null && selectedIdx !== null) {
      const el = elements[selectedIdx];
      const newEl = { ...el };
      if (resizingHandle === 0) {
        newEl.x = mouseX;
        newEl.y = mouseY;
        newEl.w = el.w + (el.x - mouseX);
        newEl.h = el.h + (el.y - mouseY);
      } else if (resizingHandle === 1) {
        newEl.y = mouseY;
        newEl.w = mouseX - el.x;
        newEl.h = el.h + (el.y - mouseY);
      } else if (resizingHandle === 2) {
        newEl.x = mouseX;
        newEl.w = el.w + (el.x - mouseX);
        newEl.h = mouseY - el.y;
      } else if (resizingHandle === 3) {
        newEl.w = mouseX - el.x;
        newEl.h = mouseY - el.y;
      }
      newEl.w = Math.max(20, newEl.w);
      newEl.h = Math.max(20, newEl.h);
      if (el.type === "text") newEl.fontSize = Math.max(12, newEl.h - 8);
      const newElements = elements.map((s, idx) =>
        idx === selectedIdx ? newEl : s
      );
      setHistory((h) => {
        const newHistory = h.slice(0, historyIndex + 1);
        newHistory[historyIndex] = { elements: newElements, lines };
        return newHistory;
      });
      return;
    }


    if (isDragging && selectedIdx !== null) {
      const newElements = elements.map((s, idx) =>
        idx === selectedIdx
          ? { ...s, x: mouseX - dragOffset.x, y: mouseY - dragOffset.y }
          : s
      );
      setHistory((h) => {
        const newHistory = h.slice(0, historyIndex + 1);
        newHistory[historyIndex] = { elements: newElements, lines };
        return newHistory;
      });
    }


    if (isDrawing && (drawMode || eraserMode)) {
      const ctx = canvasRef.current.getContext("2d");
      const points = drawingPointsRef.current;
      points.push([mouseX, mouseY]);
      ctx.beginPath();
      ctx.moveTo(points[points.length - 2][0], points[points.length - 2][1]);
      ctx.lineTo(mouseX, mouseY);
      ctx.lineWidth = eraserMode ? eraserSize : brushSize;
      ctx.strokeStyle = eraserMode ? "rgba(0,0,0,1)" : pencilColor;
      ctx.globalCompositeOperation = eraserMode ? "destination-out" : "source-over";
      ctx.stroke();
      ctx.globalCompositeOperation = "source-over";
    }
  };


const handleCanvasMouseUp = () => {
  if (isDrawing) {
    if (!canvasRef.current) return;
    const newLine = {
      id: nextId++,
      points: drawingPointsRef.current,
      color: pencilColor,
      size: eraserMode ? eraserSize : brushSize,
      mode: eraserMode ? "eraser" : "draw",
    };
    saveState(elements, [...lines, newLine], designName);
  }
  if (resizingHandle !== null) setResizingHandle(null);
  if (isDragging) setIsDragging(false);
  setIsDrawing(false);
};


  const handleAddShape = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const { w, h } = getDefaultSize(selectedShape, "", ctx);
    const newElement = {
      id: nextId++,
      type: selectedShape,
      x: 300,
      y: 100,
      color: shapeColor,
      w,
      h,
      rotation: 0,
    };
    if (selectedShape === "image") return;
    saveState([...elements, newElement], lines, designName);
  };


  const [fontFamily, setFontFamily] = useState("Arial");
  const handleAddText = () => {
  if (!canvasRef.current) return;
  const text = prompt("Enter text to add:");
  if (!text) return;
  const ctx = canvasRef.current.getContext("2d");
  ctx.font = `24px ${fontFamily}`;
  const { w, h, fontSize } = getDefaultSize("text", text, ctx);
  const newText = {
    id: nextId++,
    type: "text",
    text,
    x: 100,
    y: 100,
    color: textColor,
    w,
    h,
    fontSize,
    fontFamily, // <-- add this
    rotation: 0,
  };
  saveState([...elements, newText], lines, designName);
};



  const handleShapeColorChange = (e) => {
    setShapeColor(e.target.value);
    if (selectedIdx !== null) {
      const newElements = elements.map((el, idx) =>
        idx === selectedIdx ? { ...el, color: e.target.value } : el
      );
      saveState(newElements, lines, designName);
    }
  };


  const handleTextColorChange = (e) => {
    setTextColor(e.target.value);
    if (selectedIdx !== null && elements[selectedIdx]?.type === "text") {
      const newElements = elements.map((el, idx) =>
        idx === selectedIdx ? { ...el, color: e.target.value } : el
      );
      saveState(newElements, lines, designName);
    }
  };


  const handleUploadImage = () => {
    fileInputRef.current.click();
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (event) {
      const newElement = {
        id: nextId++,
        type: "image",
        x: 50,
        y: 50,
        w: 200,
        h: 200,
        src: event.target.result,
        rotation: 0,
      };
      saveState([...elements, newElement], lines, designName);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };


  const moveElement = (dir) => {
    if (selectedIdx === null) return;
    const newElements = [...elements];
    let idx = selectedIdx;
    if (dir === "up" && idx < newElements.length - 1) {
      [newElements[idx], newElements[idx + 1]] = [
        newElements[idx + 1],
        newElements[idx],
      ];
      setSelectedIdx(idx + 1);
    }
    if (dir === "down" && idx > 0) {
      [newElements[idx], newElements[idx - 1]] = [
        newElements[idx - 1],
        newElements[idx],
      ];
      setSelectedIdx(idx - 1);
    }
    saveState(newElements, lines, designName);
  };


  const clearCanvas = () => {
    setHistory([{ elements: [], lines: [], title: designName }]);
    setHistoryIndex(0);
    setSelectedIdx(null);
  };


  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = designName.trim() || "canvas.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
  };


  const handleDeleteSelected = () => {
    if (selectedIdx !== null) {
      const newElements = elements.filter((_, idx) => idx !== selectedIdx);
      saveState(newElements, lines, designName);
      setSelectedIdx(null);
    }
  };


const handleSaveToCloud = async () => {
  setSaveMessage(""); // Clear old messages first
  try {
    const token = localStorage.getItem("token");
    const imageDataURL = canvasRef.current.toDataURL("image/png");
    const imageBlob = dataURLtoBlob(imageDataURL);


    // Upload PNG to Cloudinary
    const formData = new FormData();
    formData.append("file", imageBlob);
    formData.append("upload_preset", "MattyDesignTool");
    const res = await fetch("https://api.cloudinary.com/v1_1/dvxazjesy/image/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    const thumbnailUrl = data.secure_url;


    // Create your design JSON object
    const jsonData = {
      elements,
      lines,
      title: designName
    };


    let response;
    if (designId) {
      // Existing design: update
      response = await fetch(`http://localhost:5000/api/designs/${designId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: designName,
          thumbnailUrl,
          jsonData,
        }),
      });
    } else {
      // New design: create
      response = await fetch('http://localhost:5000/api/designs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: designName,
          thumbnailUrl,
          jsonData,
        }),
      });
    }


    if (!response.ok) throw new Error("Failed to save design!");
    setSaveMessage("✅ Design saved successfully!");
  } catch (err) {
    setSaveMessage("❌ Save failed: " + err.message);
  }
};







  // small animation presets
  const cardAnim = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };
  const btnHover = { scale: 1.03 };
  const btnTap = { scale: 0.97 };


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#0f172a] via-[#0b1220] to-[#071024] text-slate-100">
      
      <header className="flex justify-between items-center p-4 bg-gradient-to-r from-[#0ea5e9] via-[#8b5cf6] to-[#ef4444] shadow-xl">
        {/* Logo - clickable to dashboard (keeps original MATTY text and font but made clickable) */}
        <motion.div
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => navigate("/dashboard")}
          whileHover={{ scale: 1.02, rotate: 0.5 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 140 }}
        >
          <div className="text-5xl font-extrabold" style={{ fontFamily: '"Kablammo", system-ui', textShadow: "0 6px 20px rgba(0,0,0,0.35)" }}>
            MATTY
          </div>
          <div className="text-sm font-medium opacity-90">Design Studio</div>
        </motion.div>


        <div className="flex items-center gap-4">
          <motion.div whileHover={btnHover} whileTap={btnTap}>
  <Link
    to="/about"
    className="px-3 py-1.5 rounded-md bg-white text-slate-900 font-medium shadow"
  >
    About us
  </Link>
</motion.div>


          <motion.button
            onClick={handleSaveToCloud}
            whileHover={btnHover}
            whileTap={btnTap}
            className="px-3 py-1 rounded-md bg-white text-slate-900 font-medium shadow"
          >
            Save
          </motion.button>


          <motion.button
            onClick={handleDownload}
            whileHover={btnHover}
            whileTap={btnTap}
            className="px-3 py-1 rounded-md bg-white/10 text-white border border-white/20"
          >
            Export
          </motion.button>
        </div>
      </header>


      <div className="p-3 bg-slate-900/30 flex items-center gap-4 border-b border-slate-800">
        <input
          className="border border-slate-700 bg-slate-800/50 placeholder-slate-400 px-3 py-2 rounded font-medium text-lg flex-grow text-white shadow-inner"
          placeholder="Enter design name"
          value={designName}
          onChange={(e) => {
            const newTitle = e.target.value;
            setDesignName(newTitle);
            saveState(elements, lines, newTitle);
          }}
        />
        <div className="flex gap-2">
          <motion.button onClick={clearCanvas} whileHover={btnHover} whileTap={btnTap} className="px-3 py-2 rounded bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white shadow">Clear All</motion.button>
          <motion.button onClick={handleUndo} disabled={historyIndex === 0} whileHover={btnHover} whileTap={btnTap} className="px-3 py-2 rounded bg-slate-800/60 text-white border border-slate-700">Undo</motion.button>
          <motion.button onClick={handleRedo} disabled={historyIndex === history.length - 1} whileHover={btnHover} whileTap={btnTap} className="px-3 py-2 rounded bg-slate-800/60 text-white border border-slate-700">Redo</motion.button>
        </div>
      </div>


      <div className="flex gap-4 p-4">
        <aside className="flex flex-col gap-6 p-4 bg-gradient-to-b from-slate-800/60 to-slate-900/40 border border-slate-800 rounded-2xl w-80 shadow-2xl">
          <motion.div className="bg-slate-900/70 rounded-lg p-4 shadow-inner" variants={cardAnim} initial="hidden" animate="show">
            <h3 className="font-semibold text-lg mb-3 border-b border-slate-700 pb-2 text-slate-200">Drawing Tools</h3>
            <div className="flex gap-2 mb-3">
              <motion.button
                className={`py-2 px-4 rounded ${drawMode && !eraserMode ? "bg-gradient-to-r from-[#60a5fa] to-[#a78bfa] text-white font-semibold" : "bg-slate-800/40 text-white"}`}
                onClick={() => {
                  if (drawMode) setDrawMode(false);
                  else {
                    setDrawMode(true);
                    setEraserMode(false);
                  }
                }}
                whileHover={btnHover}
                whileTap={btnTap}
              >
                Pencil
              </motion.button>
              <motion.button
                className={`py-2 px-4 rounded ${eraserMode ? "bg-gradient-to-r from-[#fca5a5] to-[#fecaca] text-white font-semibold" : "bg-slate-800/40 text-white"}`}
                onClick={() => {
                  if (eraserMode) setEraserMode(false);
                  else {
                    setEraserMode(true);
                    setDrawMode(false);
                  }
                }}
                whileHover={btnHover}
                whileTap={btnTap}
              >
                Eraser
              </motion.button>
            </div>
            <div className="mb-3">
              <label className="block text-sm mb-1 text-slate-300">Pencil Color</label>
              <input
                type="color"
                value={pencilColor}
                onChange={(e) => setPencilColor(e.target.value)}
                className="w-10 h-10 p-0 border-0 rounded"
                title="Pencil Color"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm mb-1 text-slate-300">Brush Size</label>
              <input
                type="range"
                min={1}
                max={30}
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-slate-400">{brushSize}px</span>
            </div>
            <div>
              <label className="block text-sm mb-1 text-slate-300">Eraser Size</label>
              <input
                type="range"
                min={5}
                max={50}
                value={eraserSize}
                onChange={(e) => setEraserSize(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-slate-400">{eraserSize}px</span>
            </div>
          </motion.div>


          <motion.div className="bg-slate-900/70 rounded-lg p-4 shadow-inner" variants={cardAnim} initial="hidden" animate="show">
            <h3 className="font-semibold text-lg mb-3 border-b border-slate-700 pb-2 text-slate-200">Shapes</h3>
            <label className="block text-sm mb-1 text-slate-300">Shape</label>
            <select
              className="mb-3 p-2 border rounded w-full bg-slate-800/40 text-white"
              value={selectedShape}
              onChange={(e) => {
                setSelectedShape(e.target.value);
                setDrawMode(false);
                setEraserMode(false);
              }}
            >
              <option value="rectangle">Rectangle</option>
              <option value="square">Square</option>
              <option value="circle">Circle</option>
              <option value="oval">Oval</option>
              <option value="triangle">Triangle</option>
              <option value="parallelogram">Parallelogram</option>
              <option value="rhombus">Rhombus</option>
              <option value="trapezoid">Trapezoid</option>
              <option value="kite">Kite</option>
              <option value="pentagon">Pentagon</option>
              <option value="hexagon">Hexagon</option>
              <option value="heptagon">Heptagon</option>
              <option value="octagon">Octagon</option>
              <option value="nonagon">Nonagon</option>
              <option value="decagon">Decagon</option>
            </select>
            <label className="block text-sm mb-1 text-slate-300">Shape Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={shapeColor}
                onChange={handleShapeColorChange}
                className="w-10 h-10 p-0 border-0 rounded"
              />
              <motion.button
                className="flex-1 py-2 rounded bg-gradient-to-r from-[#60a5fa] to-[#a78bfa] text-white"
                onClick={handleAddShape}
                whileHover={btnHover}
                whileTap={btnTap}
              >
                Add Shape
              </motion.button>
            </div>


            <div className="flex gap-2 mt-3">
              <motion.button whileHover={btnHover} whileTap={btnTap} onClick={() => moveElement("up")} className="flex-1 py-2 rounded bg-slate-800/40">Move Up</motion.button>
              <motion.button whileHover={btnHover} whileTap={btnTap} onClick={() => moveElement("down")} className="flex-1 py-2 rounded bg-slate-800/40">Move Down</motion.button>
            </div>
          </motion.div>


          <motion.div className="bg-slate-900/70 rounded-lg p-4 shadow-inner" variants={cardAnim} initial="hidden" animate="show">
            <h3 className="font-semibold text-lg mb-3 border-b border-slate-700 pb-2 text-slate-200">Text</h3>
            
            <label className="block text-sm mt-2 mb-1 text-slate-300">Text Font</label>
<select
  className="mb-3 p-2 border rounded w-full bg-slate-800/40 text-white"
  value={fontFamily}
  onChange={e => {
    setFontFamily(e.target.value);
    if (selectedIdx !== null && elements[selectedIdx]?.type === "text") {
      const newElements = elements.map((el, idx) =>
        idx === selectedIdx ? { ...el, fontFamily: e.target.value } : el
      );
      saveState(newElements, lines, designName);
    }
  }}
>
  <option value="Arial">Arial</option>
  <option value="Times New Roman">Times New Roman</option>
  <option value="Georgia">Georgia</option>
  <option value="Courier New">Courier New</option>
  <option value="Comic Sans MS">Comic Sans MS</option>
  <option value="Verdana">Verdana</option>
  <option value="Trebuchet MS">Trebuchet MS</option>
  <option value="Lucida Console">Lucida Console</option>
  <option value="Impact">Impact</option>
  <option value="Tahoma">Tahoma</option>
  <option value="Palatino Linotype">Palatino Linotype</option>
  <option value="Garamond">Garamond</option>
  <option value="Brush Script MT">Brush Script MT</option>
  <option value="Helvetica">Helvetica</option>
  <option value="Futura">Futura</option>
  <option value="Gill Sans">Gill Sans</option>
  <option value="Rockwell">Rockwell</option>
  <option value="Franklin Gothic Medium">Franklin Gothic Medium</option>
  <option value="Copperplate">Copperplate</option>
  <option value="Optima">Optima</option>
</select>
<label className="block text-sm mb-1 text-slate-300">Text Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={textColor}
                onChange={handleTextColorChange}
                className="w-10 h-10 p-0 border-0 rounded"
              />
              <motion.button
                className="flex-1 py-2 rounded bg-gradient-to-r from-[#34d399] to-[#10b981] text-white"
                onClick={handleAddText}
                whileHover={btnHover}
                whileTap={btnTap}
              >
                Add Text
              </motion.button>
            </div>
          </motion.div>


          <motion.div className="bg-slate-900/70 rounded-lg p-4 shadow-inner" variants={cardAnim} initial="hidden" animate="show">
            <h3 className="font-semibold text-lg mb-3 border-b border-slate-700 pb-2 text-slate-200">Export / Images</h3>
            <div className="flex flex-col gap-2">
              <motion.button className="py-2 rounded bg-slate-800/40 text-white" onClick={handleUploadImage} whileHover={btnHover} whileTap={btnTap}>Upload Image</motion.button>
              <motion.button className="py-2 rounded bg-gradient-to-r from-[#fde68a] to-[#fca5a5] text-slate-900 font-semibold" onClick={handleSaveToCloud} whileHover={btnHover} whileTap={btnTap}>Save to Cloud</motion.button>
              <motion.button className="py-2 rounded bg-slate-800/40 text-white" onClick={handleDownload} whileHover={btnHover} whileTap={btnTap}>Download</motion.button>
              {saveMessage && (
                <div className={`mt-2 p-2 rounded text-sm ${saveMessage.startsWith("✅") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                  {saveMessage}
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </motion.div>
        </aside>


        {/* FIX: added min-w-0 to allow flex shrinking and max width to main wrapper */}
      <main className="flex-1 flex items-center justify-center min-w-0 -mt-28">



          <motion.div
            initial={{ scale: 0.995, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="bg-gradient-to-b from-white/5 to-white/2 p-6 rounded-3xl shadow-2xl border border-white/5 w-full max-w-[1000px]"
          >
            <div className="max-w-[1000px] w-full h-[700px] rounded-xl overflow-hidden relative">
              <canvas
                ref={canvasRef}
                width={1000}
                height={700}
                style={{ background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)", border: "2px solid rgba(80,80,80,0.2)" }}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
              />
              {/* overlay little HUD */}
              <div className="absolute left-4 top-4 bg-black/30 text-white px-3 py-1 rounded backdrop-blur-sm text-xs">Pro Canvas • {elements.length} elements</div>
              <div className="absolute right-4 bottom-4 bg-black/20 text-white px-3 py-1 rounded text-xs">Status: {saveMessage ? saveMessage : "Unsaved"}</div>
            </div>


            <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
              <div>Selected: {selectedIdx !== null ? (elements[selectedIdx]?.type || '—') : 'None'}</div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2">Rotation
                  <input type="range" min={0} max={360} value={selectedIdx !== null ? elements[selectedIdx].rotation || 0 : 0} onChange={(e) => { if (selectedIdx !== null) { const angle = Number(e.target.value); const newElements = elements.map((el, idx) => idx === selectedIdx ? { ...el, rotation: angle } : el); saveState(newElements, lines, designName); } }} className="mx-2" />
                </label>
                <span className="text-slate-300">{selectedIdx !== null ? elements[selectedIdx].rotation || 0 : 0}°</span>
                <motion.button onClick={handleDeleteSelected} whileHover={btnHover} whileTap={btnTap} className="px-3 py-1 rounded bg-red-600 text-white ml-3">Delete Selected</motion.button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};


export default CanvasEditor;
