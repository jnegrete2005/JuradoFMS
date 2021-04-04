document.getElementById('end-btn').addEventListener('click', () => {
  // If it wasn't a tie, just refresh the browser
  if (document.getElementById('end-btn').dataset.isEnd === 'true') {
    location.assign('http://127.0.0.1:8000/vota/');
    return;
  }
});
