const def_prefs = [
    //0          1         2         3         4           5        6           7         8         9
    "Undefined", "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県", "茨城県", "栃木県", // 0 - 9
    "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県", "新潟県", "富山県", "石川県", "福井県", "山梨県", // 10 - 19
    "長野県", "岐阜県", "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", // 20 - 29
    "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県", // 30 - 39
    "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県", // 40 - 47
];

const def_prefs_short = [
    //0          1         2       3       4        5       6         7        8      9
    "Undefined", "北海道", "青森", "岩手", "宮城", "秋田", "山形", "福島", "茨城", "栃木", // 0 - 9
    "群馬", "埼玉", "千葉", "東京", "神奈川", "新潟", "富山", "石川", "福井", "山梨", // 10 - 19
    "長野", "岐阜", "静岡", "愛知", "三重", "滋賀", "京都", "大阪", "兵庫", "奈良", // 20 - 29
    "和歌山", "鳥取", "島根", "岡山", "広島", "山口", "徳島", "香川", "愛媛", "高知", // 30 - 39
    "福岡", "佐賀", "長崎", "熊本", "大分", "宮崎", "鹿児島", "沖縄", // 40 - 47
]

const initial_values = [
    ["都道府県", "法定人口"],
    ["東京都", "13,515,271"],
    ["神奈川県", "9,126,214"],
    ["大阪府", "8,839,469"],
    ["愛知県", "7,483,128"],
    ["埼玉県", "7,266,534"],
    ["千葉県", "6,222,666"],
    ["兵庫県", "5,534,800"],
    ["北海道", "5,381,733"],
    ["福岡県", "5,101,556"],
    ["静岡県", "3,700,305"],
    ["茨城県", "2,916,976"],
    ["広島県", "2,843,990"],
    ["京都府", "2,610,353"],
    ["宮城県", "2,333,899"],
    ["新潟県", "2,304,264"],
    ["長野県", "2,098,804"],
    ["岐阜県", "2,031,903"],
    ["栃木県", "1,974,255"],
    ["群馬県", "1,973,115"],
    ["岡山県", "1,921,525"],
    ["福島県", "1,914,039"],
    ["三重県", "1,815,865"],
    ["熊本県", "1,786,170"],
    ["鹿児島県", "1,648,177"],
    ["沖縄県", "1,433,566"],
    ["滋賀県", "1,412,916"],
    ["山口県", "1,404,729"],
    ["愛媛県", "1,385,262"],
    ["長崎県", "1,377,187"],
    ["奈良県", "1,364,316"],
    ["青森県", "1,308,265"],
    ["岩手県", "1,279,594"],
    ["大分県", "1,166,338"],
    ["石川県", "1,154,008"],
    ["山形県", "1,123,891"],
    ["宮崎県", "1,104,069"],
    ["富山県", "1,066,328"],
    ["秋田県", "1,023,119"],
    ["香川県", "976,263"],
    ["和歌山県", "963,579"],
    ["山梨県", "834,930"],
    ["佐賀県", "832,832"],
    ["福井県", "786,740"],
    ["徳島県", "755,733"],
    ["高知県", "728,276"],
    ["島根県", "694,352"],
    ["鳥取県", "573,441"],
];


const dic_pref = {};
def_prefs.forEach((pref, i) => {
    dic_pref[pref] = i;
});
def_prefs_short.forEach((pref, i) => {
    dic_pref[pref] = i;
});

const maps = [
    { "name": "Full", "location": "./map-full.svg" },
    { "name": "Mobile", "location": "./map-mobile.svg" },
    { "name": "Polygon", "location": "./map-polygon.svg" },
    { "name": "Circle", "location": "./map-circle.svg" },
];
const map_names = { "Full": 0, "Mobile": 1, "Polygon": 2, "Circle": 3 };
const selector = document.querySelector('#selector');

selector.append(...maps.map(map => {
    const option = document.createElement('option');
    Option.value = map.name;
    option.innerHTML = map.name;
    return option;
}));

const hash = new URLSearchParams(window.location.hash);
const color_picker = document.querySelector('#color');
let color = '#' + (hash.get('color') || '0000FF');
color_picker.value = color;

color_picker.addEventListener('change', () => {
    color = color_picker.value;
    drawMap();
});

const map_area = document.querySelector('#map');

async function selectMap(map = maps[0]) {
    const res = await fetch(map.location);

    selector.value = map.name;

    if (res.ok) {
        const svg = await res.text();
        map_area.innerHTML = svg;
        const prefectures = document.querySelectorAll('.prefecture');

        prefectures.forEach(prefecture => {
            const id = prefecture.getAttribute('data-code');
            prefecture.setAttribute('id', "pref_" + String(id));
            prefecture.removeAttribute('fill');
        });
        drawMap();
    }
}

selector.addEventListener('change', async(e) => {
    map = maps[e.target.selectedIndex];
    selectMap(map);
});

selectMap(maps[map_names[hash.get('map')]] || maps[0]);

const table = x_spreadsheet('#table', { showToolbar: false, showBottomBar: false, row: { len: 48 }, col: { len: 2 } }).change(drawMap);
document.querySelector('.x-spreadsheet-bottombar').style.display = 'none';
table.data.addStyle({ bgcolor: "#444444", color: "#ffffff" });

// parameters
// /pages/#title=都道府県地図グラフ&map=Full&color=0000ff&data=都道府県;法定人口:東京都;13,515,271:神奈川県;9,126,214
// /pages/#title=東京・神奈川&data=東京都;124.5:神奈川県;500


function sanitize(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const title = sanitize(hash.get('title'));
if (title.length > 0) {
    document.querySelector('title').innerHTML = title;
    document.querySelector('#title').innerHTML = title;
}

const params = hash.get('data') || '';
if (params.length > 0) {
    params.split(':').forEach((param, i) => {
        const [k, v] = param.split(';');
        table.cellText(i, 0, k).cellText(i, 1, v);
    });
} else {
    initial_values.forEach((pref, i) => {
        table.cellText(i, 0, pref[0]).cellText(i, 1, pref[1]);
    });
}

table.reRender();

function getTableData() {
    const data = {};
    let max_value = Number.NEGATIVE_INFINITY;
    let min_value = Number.POSITIVE_INFINITY;
    for (let i = 0; i < table.data.rows.len; i++) {
        const cell = table.cell(i, 0);
        if (cell != null) {
            key = String(cell.text).trim();
            val = parseFloat(String(table.cell(i, 1).text).trim().replace(/,/g, '')) || 0;
            data[key] = val;

            max_value = val > max_value ? val : max_value;
            min_value = val < min_value ? val : min_value;
        }
    }

    for (let key in data) {
        const val = data[key];
        const normalized_value = (val - min_value) / (max_value - min_value);
        data[key] = normalized_value;
    }
    return data;
}

function drawMap() {
    for (let i = 1; i < 48; i++) {
        const pref = document.querySelector("#pref_" + String(i));
        pref.style.fill = color;
        pref.style.fillOpacity = 0;
        pref.style.stroke = '#000000';
        pref.style.strokeWidth = '1px';
        pref.style.strokeDasharray = '1 4';
    }
    data = getTableData();
    for (let key in data) {
        const id = dic_pref[key];
        const val = data[key];
        const pref = document.querySelector("#pref_" + String(id));
        if (pref != null) {
            pref.style.fill = color;
            pref.style.fillOpacity = val;
            pref.style.stroke = '#000000';
            pref.style.strokeWidth = '2px';
            pref.style.strokeOpacity = 1;
            pref.style.strokeDasharray = '';
        }
    }

    document.querySelector('#title').style.color = color;
    document.querySelectorAll('input,button').forEach(e => {
        e.style.borderColor = color;
        e.style.backgroundColor = color;
    });
    changeIcon();
    createUrl();

    for (let i = 0; i < table.data.rows.len; i++) {
        const col0 = table.cell(i, 0).text;
        const col1 = table.cell(i, 1).text;
        if (!(col0 in dic_pref)) {
            table.data.rows.setCell(i, 0, { text: col0, style: 0 });
            table.data.rows.setCell(i, 1, { text: col1, style: 0 });
        }
    }

    table.reRender();

}

function svgData() {
    const svg = map_area.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    return "data:image/svg+xml;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(svgData)));
}

function exportImage() {
    const a = document.createElement("a");
    a.href = svgData();
    a.setAttribute("download", document.querySelector('#title').textContent + ".svg");
    a.dispatchEvent(new MouseEvent("click"));
}

function createUrl() {
    const url = new URL(window.location.href);
    const params = new URLSearchParams();
    params.set('title', document.querySelector('#title').textContent);
    params.set('map', document.querySelector('#selector').value);
    params.set('color', document.querySelector('#color').value.replace(/#/, ''));

    const data = [];
    for (let i = 0; i < table.data.rows.len; i++) {
        const col0 = table.cell(i, 0);
        const col1 = table.cell(i, 1);
        const col0_text = col0 ? col0.text : null;
        const col1_text = col1 ? col1.text : null;
        if (col0_text || col1_text) {
            data[i] = (col0_text + ';' + col1_text).trim();
        }
    }

    url.hash = '&' + params.toString();
    const urlString = url.toString() + '&data=' + data.join(':');
    window.location.href = urlString;

    const twitter_url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(document.querySelector('#title').textContent) + '&url=' + encodeURIComponent(url.toString() + '&data=' + encodeURIComponent(data.join(':')));
    document.querySelector('#share_twitter').addEventListener('click', () => {
        window.open(twitter_url);
    });
}

function changeIcon() {
    const icon = document.querySelector('#icon');
    icon.setAttribute('href', svgData());
}

document.querySelector('#dl_svg').addEventListener('click', exportImage);

document.querySelector('#title').addEventListener('click', e => {
    e.target.contentEditable = true;
    e.target.focus();
});

document.querySelector('#title').addEventListener('focusout', e => {
    e.target.contentEditable = false;
    drawMap();
});