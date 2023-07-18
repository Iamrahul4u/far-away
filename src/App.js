import { useState } from 'react';
import './index';


let initialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: false },
  { id: 2, description: "Socks", quantity: 12, packed: false },
];
function App() {
  const [items, setItems] = useState([]);

  function handleAddItems(item) {
    setItems([...items, item]);
  }

  function handleDeleteItems(id) {
    setItems((items) => items.filter(item => item.id !== id))
  }

  function handleToggle(id) {
    setItems((items) => items.map(item => item.id === id ? { ...item, packed: !item.packed } : item))
  }

  function handleClearList() {
    const confirm = window.confirm("Do You want to clear the list");
    if (confirm) setItems([]);
  }
  return (
    <div className='app'>
      <Logo />
      <Form onAddItems={handleAddItems} />
      <List items={items} onDeleteItem={handleDeleteItems} onToggle={handleToggle} onClear={handleClearList} />
      <Stats items={items} />
    </div>
  );
}


function Logo() {
  return (
    <h1>🛫 Far Away</h1>
  )
}

function Form({ onAddItems }) {
  const [description, setDescription] = useState("");
  const [quantity, setquantity] = useState(1);
  function handleSubmit(e) {
    e.preventDefault();
    const newItem = {
      description,
      quantity,
      packed: false,
      id: Date.now(),

    };
    onAddItems(newItem);
    setDescription("");
    setquantity(1);
    console.log(newItem);

  }
  return (
    <form className='add-form' onSubmit={handleSubmit}>
      <h3>What Do you Need for the Trip??</h3>
      <select
        value={quantity}
        onChange={(e) => setquantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((i) =>
          <option value={i} key={i} >
            {i}
          </option>
        )}
      </select>
      <input type='text' placeholder='Item..' value={description} onChange={(e) => setDescription(e.target.value)} />
      <button >Add</button>
    </form>
  )
}

// Packing List
function List({ items, onDeleteItem, onToggle, onClear }) {

  const [sorted, setSorted] = useState('input')
  let sortedArray;
  if (sorted === 'input') sortedArray = items;
  if (sorted === 'description') sortedArray = items.slice().sort((a, b) => a.description.localeCompare(b.description));
  if (sorted === 'packed') sortedArray = items.slice().sort((a, b) => Number(a.packed) - Number(b.packed));

  return (
    <div className='list'>
      <ul>
        {
          sortedArray.map((item) =>
            <Item item={item} onDeleteItem={onDeleteItem} onToggle={onToggle} />
          )
        }
      </ul>
      <div className='actions'>
        <select value={sorted} onChange={(e) => setSorted(e.target.value)}>
          <option value='input'>Sort By Input</option>
          <option value='description'>Sort By Description</option>
          <option value='packed'>Sort By Packed</option>
        </select>
        <button onClick={() => onClear()}>CLear List</button>
      </div>
    </div>
  )

}
function Item({ item, onDeleteItem, onToggle }) {
  return (
    <li key={item.id}>
      <input type='checkbox' value={item.packed} onClick={() => onToggle(item.id)} />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>{item.quantity + " " + item.description}</span>
      <button onClick={() => onDeleteItem(item.id)}>❌</button>
    </li>
  )
}
function Stats({ items }) {
  if (items.length === 0) return (
    <em className='stats'>Your List is Empty add some items..📃</em>
  )
  const numItems = items.length;
  const packedItems = items.filter(item => item.packed).length;
  const percentage = Math.round((packedItems / numItems) * 100);
  return (
    <div className='stats'>
      {percentage === 100 ? <em>All set We're Ready to Go..🧳</em> :
        <h3>You Have packed {packedItems} items out of {numItems} items ({percentage}%)</h3>
      }</div>
  )
}
export default App;
