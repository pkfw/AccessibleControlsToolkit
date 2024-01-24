/**
 * 사용 필요시
 * 1. import    : import WebAccessibility from "@/js/WebAccessibility.js";
 * 2. data 선언 : wa: null,
 * 3. mounted() : this.wa = new WebAccessibility();
 * 4. 호출 예시  : this.wa.table().keyDownArrow(event, row, col, dataSize, perRow);
 */

export default class WebAccessibility {
    table() {
        return {
            keyDownArrow: keyDownArrow,
            getIndex: getIndex,
            focusCell: focusCell,
        }
    }
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