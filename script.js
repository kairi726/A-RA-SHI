/**
 * ボタン選択処理
 * @param {string} type - 'genre' または 'atmosphere'
 * @param {string} value - 送信する値
 * @param {HTMLElement} element - クリックされた要素
 */
function selectBtn(type, value, element) {
    // 1. 対象グループのIDを取得
    const groupId = type + 'Group';
    const inputId = type + 'Input';
    
    // 2. そのグループ内のすべてのボタンから 'active' クラスを外す
    const group = document.getElementById(groupId);
    if (group) {
        const buttons = group.getElementsByClassName('pill-btn');
        for (let btn of buttons) {
            btn.classList.remove('active');
        }
    }

    // 3. クリックされたボタンに 'active' クラスをつける
    element.classList.add('active');

    // 4. 隠しinputに値をセットする
    const inputField = document.getElementById(inputId);
    if (inputField) {
        inputField.value = value;
    }
    
    // 確認用ログ（不要なら削除可）
    console.log(type + " selected: " + value);
}