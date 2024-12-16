import React, { useEffect, useState } from 'react'

export default function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    // const storedItems = window.api.getItems();
    // setItems(storedItems);
    console.log('window api info from useEffect:', window.api);
    try {
      console.log('Fetching items from store');
      const storedItems = window.api.getItems();
      setItems(storedItems || []);
    } catch (error) {
      console.error('Error fetching items from store:', error);
    }
  }, [])

  const handleAdd = () => {
    if (newItem.trim()) {
      window.api.addItem(newItem);
      setItems([...items, newItem]);
      setNewItem('');
    }
  }

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditValue(items[index]);
  }

  const handleSave = () => {
    window.api.updateItem(editIndex, editValue);
    const updatedItems = [...items];
    updatedItems[editIndex] = editValue;
    setItems(updatedItems);
    setEditIndex(null);
    setEditValue('');
  }

  const handleDelete = (index) => {
    window.api.deleteItem(index);
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  }

  return (
    // <div className="relative w-full h-full flex justify-center items-center bg-gray-500/65 rounded-xl"> {/* possible backdrop-blur */}
    //   {/* Draggable area */}
    //   <div
    //     className="absolute top-0 left-0 w-full h-8 bg-transparent cursor-move -z-10"
    //     style={{ WebkitAppRegion: 'drag' }}
    //   ></div>

    //   {/* Main content */}
    //   <div>
    //     <h1 className="text-2xl font-bold text-white">Welcome to Carat</h1>
    //     <p className="text-white mt-2">
    //       Your Newest Experience.
    //     </p>
    //   </div>
        
    //   {/* Close button */}
    //   <button
    //     onClick={() => window.close()}
    //     className="absolute top-2 right-2 text-white hover:text-red-500 z-10"
    //     style={{ WebkitAppRegion: 'no-drag' }}
    //   >
    //     ✖
    //   </button>
    // </div>

    <div className="relative w-full h-full flex justify-center items-center bg-gray-500/65 rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Carat App</h1>

      {/* Add Item */}
      <div className="mb-4">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white w-3/4"
          placeholder="Add a new item"
        />
        <button
          onClick={handleAdd}
          className="ml-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {/* List of Items */}
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center justify-between">
            {editIndex === index ? (
              <div className="flex items-center w-full">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="p-2 rounded bg-gray-800 text-white flex-grow"
                />
                <button
                  onClick={handleSave}
                  className="ml-2 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditIndex(null)}
                  className="ml-2 px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center w-full">
                <span>{item}</span>
                <button
                  onClick={() => handleEdit(index)}
                  className="ml-2 px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="ml-2 px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
