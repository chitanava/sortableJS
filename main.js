import Sortable from 'sortablejs';

const depth = 3;

const nestedSortables = [...document.querySelectorAll('.nested-sortable')];
for (var i = 0; i < nestedSortables.length; i++) {
  Sortable.create(nestedSortables[i], {
    group: {
      name: 'group',
      put: function (to, evt, el) {
        const toDepth = parseInt(to.el.getAttribute('data-depth'));
        const elDepth = parseInt([...el.querySelectorAll('.nested-sortable')].length) - 1;
        if (toDepth >= depth || ((elDepth + toDepth) >= depth)) {
          return false;
        }
      },
    },
    onAdd: function (evt) {
      evt.item.querySelectorAll('.nested-sortable').forEach(element => {
        const parentD = element.parentNode.closest('.nested-sortable').getAttribute('data-depth');
        element.setAttribute('data-depth', parseInt(parentD) + 1)
      });
    },
    animation: 500
  });
}

const serialize = (sortable, nestedSerialized = []) => {
  const serialized = nestedSerialized.length ? nestedSerialized : [];
  const children = [...sortable.children];
  for (const i in children) {
    const nested = children[i].querySelector('.nested-sortable');
    const parentId = children[i].parentNode.parentNode.dataset['sortableId'];
    serialized.push({
      id: children[i].dataset['sortableId'],
      position: i,
      parentId: parentId ? parentId : null,
    });

    if (nested.children.length) {
      serialize(nested, serialized)
    }
  }
  return serialized
}

const root = document.getElementById('nestedRoot');

const setResponseData = (data) => {
  const responseDataDiv = document.getElementById('response-data');
  const formattedData = JSON.stringify(data, null, 2);

  responseDataDiv.innerHTML = `<pre>${formattedData}</pre>`;
  console.table(serialize(root));
}

document.getElementById('serializeButton').addEventListener('click', function () {
  setResponseData(serialize(root));
});

setResponseData(serialize(root));