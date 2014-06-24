function simpleHash(str) {
    var hash = 0;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        strCode = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+strCode;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}