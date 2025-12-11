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

/**
 * 複数選択用ボタン処理
 * @param {string} targetName - 'genre' または 'atmosphere'
 * @param {HTMLElement} element - クリックされた要素
 */
function toggleBtn(targetName, element) {
    // 1. クリックされたボタンの active クラスを「付け外し」する
    element.classList.toggle('active');

    // 2. そのグループの中で、現在 active になっているボタンを全部探す
    const group = document.getElementById(targetName + 'Group');
    const activeButtons = group.querySelectorAll('.pill-btn.active');

    // 3. activeなボタンから data-value の値を集める
    const selectedValues = [];
    activeButtons.forEach(function(btn) {
        selectedValues.push(btn.getAttribute('data-value'));
    });

    // 4. 集めた値をカンマ区切りにして input に入れる
    // 例: "cafe,ramen,italian" のような文字列が入ります
    const inputId = targetName + 'Input';
    const inputField = document.getElementById(inputId);
    
    if (inputField) {
        inputField.value = selectedValues.join(',');
    }

    console.log(targetName + " selected: " + inputField.value);
}