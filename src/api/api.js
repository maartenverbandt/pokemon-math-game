// Save game state
fetch('/api/save', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'alice',
    settings: { sound: true, difficulty: 'hard' },
    pokemon: [
      { name: 'Pikachu', level: 5 },
      { name: 'Squirtle', level: 4 }
    ]
  })
})
  .then(res => res.json())
  .then(data => console.log(data));

// Load game state
fetch('/api/load/alice')
  .then(res => res.json())
  .then(player => {
    console.log('Loaded player:', player);
  });
