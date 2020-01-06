/**
 * 更新页面高度等状态
 */
export function updateState() {
    const invoke = parent && parent.updateIframe;
    if (invoke && typeof invoke === 'function') {
        invoke({
            url: window.location.pathname,
            height: document.body.scrollHeight
        });
    }
}

export function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;
}

/**
 * 节流函数
 * @param fn
 * @param delay
 * @param mustRunDelay
 * @returns {Function}
 */
export function throttle(fn, delay, mustRunDelay) {
    let timer = null;
    let t_start;
    return function () {
        const context = this, 
args = arguments, 
t_curr = +new Date();

        // 清除定时器
        clearTimeout(timer);

        // 函数初始化判断
        if (!t_start) {
            t_start = t_curr;
        }

        // 超时（指定的时间间隔）判断
        if (t_curr - t_start >= mustRunDelay) {
            fn.apply(context, args);
            t_start = t_curr;
        } else {
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        }
    };
}

/**
 * 数组元素排列组合
 */
function groupSplit(arr, size) {
    const r = [];

    function _(t, a, n) {
        if (n === 0) {
            r[r.length] = t;
            return;
        }
        for (let i = 0, l = a.length - n; i <= l; i++) {
            const b = t.slice();
            b.push(a[i]);
            _(b, a.slice(i + 1), n - 1);
        }
    }
    _([], arr, size);
    return r;
}
export function combination(arr) {
    if (arr.length === 0) {
        return [];
    }

    let newComb = [];
    let i = 0;
    while (i <= arr.length) {
        newComb = [...newComb, ...groupSplit(arr, i)];

        i++;
    }

    return newComb;
}