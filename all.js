
//渲染畫面與樣式

function reader() {
  const resultPass = document.querySelector('.result-pass');
  const resultNumber = document.querySelector('.result-number');
  const btnData = ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '+', '0', '00', '.', '-', 'AC', '⌫', '='];
  const number = document.querySelector('.number')
  let formula = '';
  let showResult = '0';

  btnData.forEach((item) => {
    const numberBtn = document.createElement('div');
    numberBtn.classList.add('number-btn')
    numberBtn.innerText = item

    if (item == '÷' || item == '×' || item == '+' || item == '-') {
      numberBtn.classList.add('number-btn-operator');
    } else if (item == '.') {
      numberBtn.classList.add('number-btn-dot');
    } else if (item == 'AC') {
      numberBtn.classList.add('number-btn-bottom', 'btn-clear');
    } else if (item == '⌫') {
      numberBtn.classList.add('number-btn-bottom', 'btn-delete');
    } else if (item == '=') {
      numberBtn.classList.add('number-btn-equal');
    }
    number.appendChild(numberBtn);

  })

  resultPass.innerText = formula;
  resultNumber.innerText = showResult;

  //測試數字
  const testNumber = document.querySelector('.testNumber')
  const test = document.querySelector('.test')



  //判斷所有按鈕
  const numberBtn = document.querySelectorAll('.number-btn');
  for (let i = 0; i < numberBtn.length; i++) {
    numberBtn[i].addEventListener('click', function (e) {
      if (/^[0-9\s]*$/.test(e.target.innerText)) {
        // const lastOne = formula.substring(formula.length - 1, formula.length)
        if (lastOne(formula) == '÷' ||
          lastOne(formula) == '×' ||
          lastOne(formula) == '+' ||
          lastOne(formula) == '-') {
          showResult = '0'
        }

        formula += e.target.innerText;
        formula = noDoubleZero(formula)

        if (showResult == '0') {
          showResult = ''
          console.log('點到我了')
        }
        formula = replaceOperator(formula)
        showResult += e.target.innerText
        testNumber.innerText += e.target.innerText
        newShowResult();
      }
    }, false)

  }
  //判斷+-×÷
  const operator = document.querySelectorAll('.number-btn-operator');
  for (let i = 0; i < operator.length; i++) {
    operator[i].addEventListener('click', function (e) {

      //要判斷尾巴是運算子
      // showResult = (showResult == 'undefined') ? '' : '';
      formula = replaceOperator(formula)
      formula = noDoubleOperator(formula)

      formula = `${eval(formula)}`

      showResult = formula
      testNumber.innerText += e.target.innerText
      formula += e.target.innerText
      newShowResult();
    }, false)
  }
  //判斷'.'
  const dot = document.querySelector('.number-btn-dot');
  dot.addEventListener('click', function (e) {
    formula += '.'
    formula = DoubleDotRemove(formula);

    showResult += '.'
    showResult = DoubleDotRemove(showResult);

    testNumber.innerText += '.'
    testNumber.innerText = DoubleDotRemove(testNumber.innerText);

    newShowResult()
  }, false)

  //判斷'⌫'
  const deleteLast = document.querySelector('.btn-delete');
  deleteLast.addEventListener('click', function (e) {
    if (formula.length > 1) {
      formula = formula.substring(0, formula.length - 1); //移除字串最後一位字元(抓取0到倒數第二位的字串)
      testNumber.innerText = testNumber.innerText.substring(0, testNumber.innerText.length - 1)

      showResult = showResult.substring(0, showResult.length - 1)

      newShowResult();
    } else {
      testNumber.innerText = ''
      formula = '';
      showResult = '0'
      newShowResult();
    }
  }, false)

  //判斷'AC'
  const clearAll = document.querySelector('.btn-clear');
  clearAll.addEventListener('click', function (e) {
    showResult = '0';
    testNumber.innerText = ''
    formula = '';
    newShowResult();
  }, false)

  //判斷'='
  const equal = document.querySelector('.number-btn-equal');
  equal.addEventListener('click', function (e) {
    if (lastOne(formula) == '÷' ||
      lastOne(formula) == '×' ||
      lastOne(formula) == '+' ||
      lastOne(formula) == '-') {
      formula = formula.substring(0, formula.length - 1)
      testNumber.innerText = testNumber.innerText.substring(0, testNumber.innerText.length - 1)
    }
    console.log(formula)

    formula = noDoubleZero(formula);
    showResult = eval(formula)
    newShowResult();
  }, false)

  ///////////
  // 正規式 //
  ///////////

  // 渲染前的處理
  // afterRender(computingNumber) {
  //   const newStr = this.noDoubleOperator(computingNumber);
  //   const _newStr = this.DoubleDotRemove(newStr);
  //   return this.noDoubleZero(_newStr);
  // }

  // // 運算符左右增加空白
  // addSpace(computingNumber) {
  //   return computingNumber.replace(/(\d+)([÷×+-])/g, `$1 $2 `);
  // }

  // // 替換運算符
  function replaceOperator(computingNumber) {
    const newStr = noDoubleOperator(computingNumber);
    return noDoubleZero(newStr).replace(/÷/g, `/`).replace(/×/g, `*`);
  }

  // // 排除開頭一個0以上和0後面接數字的狀況
  function noDoubleZero(computingNumber) {
    return computingNumber.replace(/^0[0-9]+/, `0`).replace(/([÷×+-])0\d+/g, `$10`);
  }

  // // 排除開頭為運算符及重複運算符情況
  function noDoubleOperator(computingNumber) {
    return computingNumber.replace(/^[÷×+-]+/, ``).replace(/([÷×+-])[÷×+-]+/g, `$1`);
  }

  // 排除異常小數點
  function DoubleDotRemove(computingNumber) {
    const newStr = computingNumber.replace(/^\.*/, ``);
    const _newStr = newStr.replace(/\.+/g, `.`);
    const __newStr = _newStr.replace(/\D00\.(\d+)/g, `0.$1`);
    const ___newStr = __newStr.replace(/([÷×+-])\./g, `$1`);
    return ___newStr.replace(/(\d+)\.+(\d+)\.*/g, `$1.$2`);
  }

  // // 千分位
  // toCurrency(num) {
  //   let newStr = num.toString().split(".");
  //   newStr[0] = newStr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  //   return newStr.join(".");
  // }

  //取最後一位
  function lastOne(formula) {
    return formula.substring(formula.length - 1, formula.length)
  }

  // 指定綁定資料
  function newShowResult() {
    test.innerText = formula;
    resultPass.innerText = testNumber.innerText
    resultNumber.innerText = showResult;
  }


}



reader()
