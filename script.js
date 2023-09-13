const board = document.querySelector("#board");

// For the movement of pots
const colorsPots = ["redPot", "bluePot", "greenPot", "yellowPot"];

// For Audio
const drop = document.querySelector("#drop");
const ladder = document.querySelector("#ladder");
const snake = document.querySelector("#snake");
const diceAudio = document.querySelector("#diceAudio");
const success = document.querySelector("#success");

// For showing the winner message
const modal = document.querySelector("#modal");
const wname = document.querySelector("#wname");
const wimg = document.querySelector("#wimg");

// For question
const question = document.querySelector('#question');
const quiz = document.querySelector('#quiz');

// For answer of question
const answerA = document.querySelector('#answerA');
const answerB = document.querySelector('#answerB');
const answerC = document.querySelector('#answerC');
const answerD = document.querySelector('#answerD');

// For correct or wrong answer
const alert = document.querySelector('#alert');
const wanswer = document.querySelector('#wanswer');

let ans = 0;
let moveAnswer = false;

// Path of ladders
let ladders = [
  [4, 16, 17, 25],
  [21, 39],
  [29, 32, 33, 48, 53, 67, 74],
  [43, 57, 64, 76],
  [63, 62, 79, 80],
  [71, 89],
];
// Path for snakes
let snakes = [
  [30, 12, 13, 7],
  [47, 46, 36, 35, 27, 15],
  [56, 44, 38, 23, 19],
  [73, 69, 51],
  [82, 79, 62, 59, 42],
  [92, 88, 75],
  [98, 97, 83, 84, 85, 77, 64, 76, 65, 55],
];

// Dice probabilities array
const diceArray = [1, 2, 3, 4, 5, 6];
// Used for looping players chances
const playerNumbers = [1, 2, 3, 4];
// Dice icon according to random dice value
const diceIcons = [
  "fa-dice-one",
  "fa-dice-two",
  "fa-dice-three",
  "fa-dice-four",
  "fa-dice-five",
  "fa-dice-six",
];
// Array of object for tracking user
const players = [
  {
    name: "Player 1",
    image: 1,
    lastDice: 0,
    score: 0,
    lastMovement: 0,
  },
  {
    name: "Player 2",
    image: 0,
    lastDice: 0,
    score: 0,
    lastMovement: 0,
  },
  {
    name: "Player 3",
    image: 3,
    lastDice: 0,
    score: 0,
    lastMovement: 0,
  },
  {
    name: "Player 4",
    image: 4,
    lastDice: 0,
    score: 0,
    lastMovement: 0,
  },
];
// Multiple screens on the page
const screen1 = document.querySelector("#screen1");
const screen2 = document.querySelector("#screen2");
const screen3 = document.querySelector("#screen3");

// Tracking the current player
let currentPlayer = 1;

// Create a board where pots are placed
const drawBoard = () => {
  let content = "";
  let boxCount = 101;
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (i % 2 === 0) boxCount--;
      content += `<div class="box" id="potBox${boxCount}"></div>`;
      if (i % 2 != 0) boxCount++;
    }
    boxCount -= 10;
  }
  board.innerHTML = content;
};

// Initial state at the beginning of the game
const initialState = () => {
  drawBoard();
  screen2.style.display = "none";
  screen3.style.display = "none";
};

initialState();

// Select players for game
let playersCount = 2;
const selectBox = document.getElementsByClassName("selectBox");
const selectPlayers = (value) => {
  selectBox[playersCount - 2].className = "selectBox";
  selectBox[value - 2].className = "selectBox selected";
  playersCount = value;
};

// To start the game
const start = () => {
  screen1.style.display = "none";
  screen2.style.display = "block";
  hideUnwantedPlayers();
};

// To back user to previous screen
const back = () => {
  screen2.style.display = "none";
  screen1.style.display = "block";
  resetPlayersCount();
};

// Next the user from screen 2 to screen 3
const next = () => {
  screen2.style.display = "none";
  screen3.style.display = "block";
  hideFinalPlayers();
  displayNames();
  disableDices();
};

// Hide the popup quiz screen
const hideQuestion = () => {
  quiz.style.display = "none";
}

// Hide the popup correct or wrong answer
const hideAlert = () => {
  alert.style.display = "none";
}

// Check the answer method
const checkAnswer = (value) => {
  if (value === ans) {
    wanswer.innerHTML = "Benar";
    alert.style.display = "block";
    hideQuestion();
    moveAnswer = true;
  } else {
    wanswer.innerHTML = "Salah";
    alert.style.display = "block";
    hideQuestion();
  }
}

// Reset the number of players in the add profile screen
const resetPlayersCount = () => {
  for (let i = 3; i < 5; i++) {
    let x = "card" + i;
    document.getElementById(x).style.display = "flex";
  }
};
// Hide unwanted Players according to the player count
const hideUnwantedPlayers = () => {
  for (let i = playersCount + 1; i < 5; i++) {
    let x = "card" + i;
    document.getElementById(x).style.display = "none";
  }
};
// Hide the final screen 3 players
const hideFinalPlayers = () => {
  for (let i = playersCount + 1; i < 5; i++) {
    let x = "playerCard" + i;
    document.getElementById(x).style.display = "none";
  }
};
// Display the name and profile icon for the users
const displayNames = () => {
  for (let i = 1; i < playersCount + 1; i++) {
    const baseURL = "images/avatars/";
    let x = "displayName" + i;
    let y = "avatar" + i;
    document.getElementById(x).innerHTML = players[i - 1].name;
    document.getElementById(y).src = baseURL + players[i - 1].image + ".png";
  }
};
// Update the name and profile icon for the users
const updateUserProfile = (playerNo, value) => {
  // Change profile to next profile in order
  const baseURL = "images/avatars/";
  if (value === 1) {
    players[playerNo - 1].image = (players[playerNo - 1].image + 1) % 8;
  } else {
    if (players[playerNo - 1].image === 0) {
      players[playerNo - 1].image = 7;
    } else {
      players[playerNo - 1].image = Math.abs(
        (players[playerNo - 1].image - 1) % 8
      );
    }
  }
  let x = "profile" + playerNo;
  document.getElementById(x).src =
    baseURL + players[playerNo - 1].image + ".png";
};
// Change the name of the player from input box
const changeName = (playerNo) => {
  let x = "name" + playerNo;
  let value = document.getElementById(x).value;
  if (value.length > 0) {
    players[playerNo - 1].name = value;
  } else {
    players[playerNo - 1].name = "Player" + playerNo;
  }
};
// Clean the board with no pots
const resetBoard = () => {
  for (let i = 0; i < 100; i++) {
    let x = i + 1;
    document.getElementById("potBox" + x).innerHTML = "";
  }
};
// Refresh the board after every dice roll
const updateBoard = () => {
  resetBoard();
  for (let i = 0; i < playersCount; i++) {
    if (players[i].score != 0) {
      let x = "potBox" + players[i].score;
      document.getElementById(
        x
      ).innerHTML += `<div class="pot ${colorsPots[i]}" >`;
    }
  }
};

/*
// Object for the questions
let objectQuestions;

// Fetch the question from json
fetch('pertanyaan.json')
.then(response => {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json
})
.then(objectQuestions => {
  console.log(objectQuestions);
  objectQuestions = objectQuestions;
})
*/

// Used for show the question
const showTheQuestion = (numberOfQuestion) => {
  quiz.className = "quiz";
  question.innerHTML = kumpulanPertanyaan[numberOfQuestion].pertanyaan;
  answerA.innerHTML = kumpulanPertanyaan[numberOfQuestion].pilihanGanda_A;
  answerB.innerHTML = kumpulanPertanyaan[numberOfQuestion].pilihanGanda_B;
  answerC.innerHTML = kumpulanPertanyaan[numberOfQuestion].pilihanGanda_C;
  answerD.innerHTML = kumpulanPertanyaan[numberOfQuestion].pilihanGanda_D;
  ans = kumpulanPertanyaan[numberOfQuestion].jawaban;
};

// Used for moving pot from one place to another
const movePot = (value, playerNumber) => {
  const playerValue = players[playerNumber - 1].score;
  let end = playerValue + value;
  if (end < 101) {
    if (end === 100) {
      setTimeout(() => {
        modal.className = "modal";
        success.play();
        const baseURL = "images/avatars/";
        wimg.src = baseURL + players[playerNumber - 1].image + ".png";
        wname.innerHTML = players[playerNumber - 1].name;
      }, value * 400);
    }
    var t = setInterval(() => {
      players[playerNumber - 1].score++;
      drop.currentTime = 0;
      drop.play();
      updateBoard();
      if (players[playerNumber - 1].score === end) {
        clearInterval(t);
      }
    }, 400);
    setTimeout(() => {
      checkLadder(players[playerNumber - 1].score, playerNumber);
      checkSnake(players[playerNumber - 1].score, playerNumber);
      setTimeout(() => {
        showTheQuestion(Math.floor(Math.random() * kumpulanPertanyaan.length));
        quiz.style.display = "block"; /* to display the new question */
      }, 400);
    }, 400 * value);
  }
};

// For random dice value
const rollDice = (playerNo) => {
  if (playerNo === currentPlayer) {
    diceAudio.play();
    const diceNumber = diceArray[Math.floor(Math.random() * diceArray.length)];
    // const diceNumber = 100;
    let x = "dice" + playerNo;
    document.getElementById(x).innerHTML = `<i class="diceImg fas ${
      diceIcons[diceNumber - 1]
    }"></i>`;
    // players[playerNo - 1].score += diceNumber;
    let tempCurrentPlayer = currentPlayer;
    currentPlayer = 0;
    // Move the current players pot
    setTimeout(() => {
      movePot(diceNumber, tempCurrentPlayer);
    }, 1000);
    setTimeout(() => {
      currentPlayer = playerNumbers[tempCurrentPlayer % playersCount];
      document.getElementById("dice" + currentPlayer).style.color = "";
      disableDices();
    }, 2000 + diceNumber * 400);
  }
};
// Disable Other player's dice that are not current player
const disableDices = () => {
  for (let i = 1; i < playersCount + 1; i++) {
    if (currentPlayer != i) {
      let x = "dice" + i;
      document.getElementById(x).style.color = "grey";
    }
  }
};

// Check the current player is on ladder or not
const checkLadder = (value, playerNumber) => {
  for (let i = 0; i < ladders.length; i++) {
    if (ladders[i][0] === value) {
      specialMove(i, playerNumber);
    }
  }
};
// Check the current player is on snake or not
const checkSnake = (value, playerNumber) => {
  for (let i = 0; i < snakes.length; i++) {
    if (snakes[i][0] === value) {
      specialMoveSnake(i, playerNumber);
    }
  }
};
// Move the pot on the ladder
const specialMove = (value, playerNumber) => {
  let i = 0;
  var t = setInterval(() => {
    players[playerNumber - 1].score = ladders[value][i];
    ladder.play();
    updateBoard();
    i++;
    if (i === ladders[value].length) {
      clearInterval(t);
    }
  }, 400);
};
// Move the pot according to snake
const specialMoveSnake = (value, playerNumber) => {
  let i = 0;
  snake.play();
  var t = setInterval(() => {
    players[playerNumber - 1].score = snakes[value][i];
    updateBoard();
    i++;
    if (i === snakes[value].length) {
      clearInterval(t);
    }
  }, 400);
};

/**
 * Kumpulan Soal dan Jawaban
 */
const kumpulanPertanyaan = (
  [
    {
      id: 1,
      pertanyaan: "Sebelum menulis teks pidato persuasif, agar isinya sistematis kita bisa membuat .....",
      pilihanGanda_A: "rubrik penilaian",
      pilihanGanda_B: "kerangka pidato",
      pilihanGanda_C: "pertanyaan-pertanyaan",
      pilihanGanda_D: "rangkuman",
      jawaban: 1,
    },
    {
      id: 2,
      pertanyaan: "Bagian teks pidato persuasif yang berisi ucapan puji syukur adalah .....",
      pilihanGanda_A: "pembuka",
      pilihanGanda_B: "isi",
      pilihanGanda_C: "penutup",
      pilihanGanda_D: "simpulan",
      jawaban: 0,
    },
    {
      id: 3,
      pertanyaan: "Salah satu ciri dalam penutup pidato persuasif adalah adanya .....",
      pilihanGanda_A: "ucapan puji syukur",
      pilihanGanda_B: "sapaan hormat",
      pilihanGanda_C: "materi inti pidato",
      pilihanGanda_D: "permohonan maaf",
      jawaban: 3,
    },
    {
      id: 4,
      pertanyaan: "Kata yang termasuk kata benda abstrak adalah .....",
      pilihanGanda_A: "kejujuran",
      pilihanGanda_B: "masyarakat",
      pilihanGanda_C: "permukiman",
      pilihanGanda_D: "pemandangan",
      jawaban: 0,
    },
    {
      id: 5,
      pertanyaan: "Kata “literasi” adalah kata teknis di bidang .....",
      pilihanGanda_A: "politik",
      pilihanGanda_B: "ekonomi",
      pilihanGanda_C: "budaya",
      pilihanGanda_D: "pendidikan",
      jawaban: 3,
    },
    {
      id: 6,
      pertanyaan: "Orang yang ahli dalam berpidato disebut .....",
      pilihanGanda_A: "operator",
      pilihanGanda_B: "orator",
      pilihanGanda_C: "moderator",
      pilihanGanda_D: "deklamator",
      jawaban: 1,
    },
    {
      id: 7,
      pertanyaan: "Antonim kata “meningkatkan” adalah .....",
      pilihanGanda_A: "merendahkan",
      pilihanGanda_B: "menurunkan",
      pilihanGanda_C: "menaikkan",
      pilihanGanda_D: "menggelembungkan",
      jawaban: 1,
    },
    {
      id: 8,
      pertanyaan: "Teks pidato persuasif adalah .....",
      pilihanGanda_A: "Teks pidato yang digunakan untuk memberikan pendapat dan fakta.",
      pilihanGanda_B: "Teks pidato yang isinya menjelaskan suatu proses kepada khalayak.",
      pilihanGanda_C: "Teks pidato yang digunakan untuk menggambarkan suatu keadaan.",
      pilihanGanda_D: "Teks pidato yang isinya bujukan atau imbauan untuk memengaruhi pendengarnya.",
      jawaban: 3,
    },
    {
      id: 9,
      pertanyaan: "Berikut ini yang tidak termasuk jenis-jenis teks pidato persuasif adalah .....",
      pilihanGanda_A: "Sambutan",
      pilihanGanda_B: "Ceramah",
      pilihanGanda_C: "Pidato instansi",
      pilihanGanda_D: "Mendongeng",
      jawaban: 3,
    },
    {
      id: 10,
      pertanyaan: "Teks persuasif terdiri dari ... bagian/struktur.",
      pilihanGanda_A: "1",
      pilihanGanda_B: "2",
      pilihanGanda_C: "3",
      pilihanGanda_D: "4",
      jawaban: 2,
    },
    {
      id: 11,
      pertanyaan: "Apa fungsi dari bagian \"Kesimpulan\" dalam teks laporan percobaan?",
      pilihanGanda_A: "Menjelaskan langkah-langkah metode",
      pilihanGanda_B: "Menyajikan data hasil pengamatan",
      pilihanGanda_C: "Memberikan evaluasi terhadap percobaan",
      pilihanGanda_D: "Merangkum temuan penting dari percobaan",
      jawaban: 2,
    },
    {
      id: 12,
      pertanyaan: "Manakah di bawah ini yang termasuk kalimat perintah?",
      pilihanGanda_A: "Daun jeruk bisa memperkaya aroma dalam masakan",
      pilihanGanda_B: "Masukkan daun jeruk yang telah dicuci!",
      pilihanGanda_C: "Apakah daun jeruk bisa menghilangkan bau amis pada ikan?",
      pilihanGanda_D: "Daun jeruk bisa digantikan dengan daun kemangi",
      jawaban: 1,
    },
    {
      id: 13,
      pertanyaan: "Apa yang dimaksud dengan \"Hipotesis\" dalam konteks teks laporan percobaan?",
      pilihanGanda_A: "Kesimpulan akhir dari percobaan",
      pilihanGanda_B: "Perbandingan antara dua variabel",
      pilihanGanda_C: "Penjelasan tentang hasil percobaan",
      pilihanGanda_D: "Prediksi tentang apa yang akan terjadi dalam percobaan",
      jawaban: 3,
    },
    {
      id: 14,
      pertanyaan: "Dalam teks laporan percobaan, apa yang dijelaskan di dalam bagian \"Pendahuluan\"?",
      pilihanGanda_A: "Hasil pengamatan dan analisis",
      pilihanGanda_B: "Langkah-langkah yang dilakukan dalam percobaan",
      pilihanGanda_C: "Latar belakang, tujuan, dan hipotesis percobaan",
      pilihanGanda_D: "Kesimpulan akhir dari percobaan",
      jawaban: 2,
    },
    {
      id: 15,
      pertanyaan: "Dalam teks laporan percobaan, apa yang dijelaskan di dalam bagian \"Tujuan\"?",
      pilihanGanda_A: "Kesimpulan akhir dari percobaan",
      pilihanGanda_B: "Hasil pengamatan dan analisis",
      pilihanGanda_C: "Alasan dan tujuan dilakukannya percobaan",
      pilihanGanda_D: "Langkah-langkah yang dilakukan dalam percobaan",
      jawaban: 2,
    },
    {
      id: 16,
      pertanyaan: "Kalimat di bawah ini yang mengandung kata kerja aktif yaitu .....",
      pilihanGanda_A: "Cairan dituangkan ke dalam botol kaca",
      pilihanGanda_B: "Sebelum memulai kegiatan, peneliti menyiapkan alat dan bahan",
      pilihanGanda_C: "Semua peralatan yang akan digunakan harus bersih",
      pilihanGanda_D: "Beberapa bahan sudah disiapkan di atas meja",
      jawaban: 1,
    },
    {
      id: 17,
      pertanyaan: "Berikut ini bagian yang tidak terdapat pada laporan adalah .....",
      pilihanGanda_A: "Tujuan",
      pilihanGanda_B: "Argumentasi",
      pilihanGanda_C: "Dasar teori",
      pilihanGanda_D: "Pembahasan",
      jawaban: 3,
    },
    {
      id: 18,
      pertanyaan: "Dari segi materi, laporan bersifat berikut ini, kecuali .....",
      pilihanGanda_A: "Lengkap",
      pilihanGanda_B: "Akurat",
      pilihanGanda_C: "Persuasif",
      pilihanGanda_D: "Faktual",
      jawaban: 2,
    },
    {
      id: 19,
      pertanyaan: "Sinonim kata memperoleh adalah .....",
      pilihanGanda_A: "Mengubah",
      pilihanGanda_B: "Mengganti",
      pilihanGanda_C: "Mengedit",
      pilihanGanda_D: "Mendapat",
      jawaban: 3,
    },
    {
      id: 20,
      pertanyaan: "Laporan dapat dibuat atau disampaikan secara .....",
      pilihanGanda_A: "Lisan",
      pilihanGanda_B: "Tulisan",
      pilihanGanda_C: "Ringkasan",
      pilihanGanda_D: "A dan B benar",
      jawaban: 3,
    },
]
);
