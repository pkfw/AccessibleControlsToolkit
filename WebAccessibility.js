/**
 * vue 에서 사용 필요시
 * 1. import    : import WebAccessibility from "@/js/WebAccessibility.js";
 * 2. data 선언 : wa: null,
 * 3. mounted() : this.wa = new WebAccessibility();
 * 4. 호출 예시  : this.wa.table().keyDownArrow(event, row, col, dataSize, perRow);
 */

export default class WebAccessibility {
    table() {
        return {
            convertTo2DArray: convertTo2DArray,
            keyDownArrow: keyDownArrow,
            getIndex: getIndex,
            focusCell: focusCell,
            addFocusClass: addFocusClass,
        }
    }
}

/**
 * 주어진 아이템들을 기반으로 2차원 테이블 구조를 생성합니다.
 * 필요한 경우 빈 셀 데이터를 추가하여 지정된 행과 열의 요구 사항을 충족시킵니다.
 * 
 * @param {Object[]} items - 테이블에 표시할 아이템들의 배열.
 * @param {number} perRow - 각 행에 표시할 아이템의 수.
 * @param {number} requiredRows - 생성할 최소 행의 수.
 * @param {Object} blankCellData - 빈 셀에 사용될 기본 데이터 객체.
 * @param {number} startIndex - 빈 셀 데이터에 사용될 시작 인덱스.
 * @param {string} indexProperty - 인덱스가 추가될 속성의 이름.
 * @returns {Object[][]} 주어진 아이템들을 포함하는 2차원 배열. 각 행은 `perRow`만큼의 아이템을 포함하며,
 *                       필요한 경우 `blankCellData`로 채워진 빈 셀을 포함합니다.
 */
function convertTo2DArray(items, perRow, requiredRows, blankCellData, indexProperty, startIndex) {
    const table = [...items];
    let currentIndex = startIndex;
  
    while (table.length < perRow * requiredRows) {
        const newBlankCell = { ...blankCellData, [indexProperty]: currentIndex++ };
        table.push(newBlankCell);
    }
  
    return table.reduce((rows, key, index) => (index % perRow === 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows, []);
}  
  
/**
 * 키보드 화살표 키에 따라 테이블의 새로운 행(row)과 열(col) 포커스 인덱스를 계산.
 * 
 * @param {Object} event - 키보드 이벤트 객체.
 * @param {number} row - 현재 선택된 행의 인덱스.
 * @param {number} col - 현재 선택된 열의 인덱스.
 * @param {number} dataSize - 전체 데이터 세트의 크기.
 * @param {number} perRow - 행 당 열의 수.
 * @returns {Object} 새로 계산된 행과 열의 인덱스를 포함하는 객체. { row, col } 형태로 반환.
 */
function keyDownArrow(event, row, col, dataSize, perRow) {
    if (!event.code.includes("Arrow")) {
        return { row, col };
    }

    const maxRow = Math.ceil(dataSize / perRow) - 1;

    switch (event.code) {
        case "ArrowUp":
            row = Math.max(0, row - 1);
            break;
        case "ArrowDown":
            row = Math.min(maxRow, row + 1);
            break;
        case "ArrowLeft":
            col = Math.max(0, col - 1);
            break;
        case "ArrowRight":
            const isLastRow = row === maxRow;
            const lastRowSize = dataSize % perRow || perRow;
            const maxCol = isLastRow ? lastRowSize - 1 : perRow - 1;
            col = Math.min(maxCol, col + 1);
            break;
    }

    return { row, col };
}

/**
 * 주어진 행과 열의 위치를 기반으로 일차원 배열에서의 인덱스를 계산.
 * 
 * @param {number} row - 행의 인덱스 (0부터 시작).
 * @param {number} col - 열의 인덱스 (0부터 시작).
 * @param {number} perRow - 한 행에 있는 요소의 수.
 * @returns {number} 계산된 일차원 배열의 인덱스.
 */
function getIndex(row, col, perRow) {
    return row * perRow + col;
}

/**
 * 주어진 인덱스에 해당하는 셀 요소에 포커스를 맞추고 해당 셀을 뷰포트의 중앙으로 스크롤.
 * 
 * @param {number} index - 포커스할 셀의 인덱스.
 * @param {Array} elements - 셀 요소들을 포함하는 배열.
 */
function focusCell(index, elements) {
    const cell = elements[index];

    if (cell?.getAttribute("tabindex") === "-1") return;

    cell.focus();
    cell.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest"});
}

/**
 * 지정된 인덱스의 요소에 'focus' 클래스를 추가하고, 나머지 요소에서는 'focus' 클래스를 제거합니다.
 * 이 함수는 주로 UI 요소의 포커스 상태를 시각적으로 나타내기 위해 사용됩니다.
 * 
 * @param {number} index - 포커스를 받을 요소의 인덱스.
 * @param {Element[]} elements - 포커스 클래스를 추가할 요소들의 배열.
 */
function addFocusClass(index, elements) {
    elements.forEach((element, idx) => {
        element.classList.toggle('focus', idx === index);
    });
}