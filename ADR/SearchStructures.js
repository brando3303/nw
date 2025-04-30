

// we actually don't need to create a trie for player pages since we will use prefix lookup over all words.
// instead this just retreives all words in all player pages and stores them in a list.
// generates a map from word to unqique word index.
generateWordIndex = (data) => {
    let seenWords = new Set();
    let wordIndex = [];
    let index = 0;
    for (let i = 0; i < data.length; i++) {
        const player = data[i];
        const playerPageText = player.playerpage_text;
        if (playerPageText) {
            const words = playerPageText.split(/\s+/);
            for (const word of words) {
                const lowerCaseWord = clean(word.toLowerCase());
                if (!seenWords.has(lowerCaseWord)) {
                    wordIndex.push({word: lowerCaseWord, index: index++});
                    seenWords.add(lowerCaseWord);
                }
            }
        }
    }
    return wordIndex;
}

// gets the index for the inputted word.
// requires that wordIndex is a list of objects with the form {word: word, index: wordIndex}
wordIndexGetIndex = (wordIndex, word) => {
    const entry = wordIndex.find(i => i.word === word);
    if (entry) {
        return entry.index;
    } else {
        return -1; // word not found
    }
}

// generates a map from player name to unqique index. acts as the file name in an inverted index. note that the 
// names are case sensitive. returns a list of objects with the form {name: playerName, index: playerNameIndex}
generateNameIndex = (data) => {
    let seenNames = new Set();
    let nameIndex = [];
    let index = 0;
    for (let i = 0; i < data.length; i++) {
        const player = data[i];
        const playerName = player.name;
        if (playerName && !seenNames.has(playerName)) {
            nameIndex.push({name: playerName, index: index++});
            seenNames.add(playerName);
        }
    }
    return nameIndex;
}

// gets the index for the inputted word.
// requires that wordIndex is a list of objects with the form {word: word, index: wordIndex}
nameIndexGetIndex = (nameIndex, name) => {
    const entry = nameIndex.find(i => i.name === name);
    if (entry) {
        return entry.index;
    } else {
        return -1; // word not found
    }
}

// generates an expanded inverted index lsit between word index -> player name index.
generateInvertedIndex = (data, wordIndex, nameIndex) => {
    let invertedIndex = [];
    for (let i = 0; i < data.length; i++) {
        const player = data[i];
        const playerIndex = nameIndexGetIndex(nameIndex, player.name);
        const playerPageText = player.playerpage_text;
        if (playerPageText) {
            const seenWords = new Set();
            const words = playerPageText.split(/\s+/);
            for (const word of words) {
                const lowerCaseWord = clean(word.toLowerCase());
                if (!seenWords.has(lowerCaseWord)) {
                    seenWords.add(lowerCaseWord);
                    const wIndex = wordIndexGetIndex(wordIndex, lowerCaseWord);
                    if (wIndex !== -1) {
                        invertedIndex.push({word_index: wIndex, player_name_index: playerIndex});
                    }
                }
            }
        }
    }
    return invertedIndex;
}

// remove non-alphanumeric characters from the beginning and end of a string
clean = (word) => {
    return word.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
}

module.exports = { generateWordIndex, generateNameIndex, generateInvertedIndex }