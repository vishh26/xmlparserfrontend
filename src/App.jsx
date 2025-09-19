import React, { useState } from "react";

function App() {
  const [jsonResult, setJsonResult] = useState(null);
  const [xmlFile, setXmlFile] = useState(null);

  const handleFileChange = (e) => {
    setXmlFile(e.target.files[0]);
  };

  const handleConvert = async () => {
  if (!xmlFile) return alert("Please upload an XML file");

  const formData = new FormData();
  formData.append("xmlFile", xmlFile); // <-- matches upload.single("xmlFile")

  try {
    // const response = await fetch("http://localhost:3000/api/xmlToJson", {
          const response = await fetch("https://xmltojsonapi.onrender.com/api/xmlToJson", {
      method: "POST",
      body: formData, // No headers needed, browser sets multipart/form-data automatically
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    setJsonResult(data);
  } catch (err) {
    console.error("Conversion failed:", err);
    alert("Failed to convert XML. Check console for details.");
  }
};

  const handleDownload = () => {
    if (!jsonResult) return;

    const jsonString = JSON.stringify(jsonResult, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "converted.json";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          XML ➝ JSON Converter
        </h2>

        <div className="flex items-center gap-4">
          <input
            type="file"
            accept=".xml"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={handleConvert}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Convert
          </button>
        </div>

        {jsonResult && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Converted JSON
            </h3>
            <pre className="bg-gray-900 text-green-400 text-sm rounded-lg p-4 overflow-x-auto overflow-y-auto max-h-96 whitespace-pre-wrap">
              {JSON.stringify(jsonResult, null, 2)}
            </pre>
            <button
              onClick={handleDownload}
              className="mt-4 px-4 py-2 bg-blue-500 text-white font-bold rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
