import React from 'react';
import {Tree, Input} from 'antd';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const TreeNode = Tree.TreeNode;
const Search = Input.Search;

const x = 3;
const y = 2;
const z = 1;
const gData = [];

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({title: key, key});
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

const dataList = [];
const generateList = (data) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const key = node.key;
    dataList.push({key, title: key});
    if (node.children) {
      generateList(node.children, node.key);
    }
  }
};
generateList(gData);

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

class Title extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            expandedKeys: [],
            searchValue: '',
            autoExpandParent: true
        }
    }

    onExpand(expandedKeys) {
        this.setState({
            expandedKeys,
            autoExpandParent: false
        });
    }

    onChange(e) {
        const value = e.target.value;
        console.log('888',value);
        const expandedKeys = dataList.map((item) => {
            console.log('777',item);
            if (item.key.indexOf(value) > -1) {
                return getParentKey(item.key, gData);
            }
            return null;
        }).filter((item, i, self) => item && self.indexOf(item) === i);
        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true
        });
    }

    render() {
        console.log("666", gData);
        const {searchValue, expandedKeys, autoExpandParent} = this.state;
        const loop = data => data.map((item) => {
            const index = item.key.search(searchValue);
            const beforeStr = item.key.substr(0, index);
            const afterStr = item.key.substr(index + searchValue.length);
            const title = index > -1 ? (
                <span>
          {beforeStr}
                    <span style={{color: '#f50'}}>{searchValue}</span>
                    {afterStr}
        </span>
            ) : <span>{item.key}</span>;
            if (item.children) {
                return (
                    <TreeNode key={item.key} title={title}>
                        {loop(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={title}/>;
        });
        return (
            <div>
                <Search style={{width: 300}} placeholder="Search" onChange={this.onChange.bind(this)}/>
                <Tree
                    onExpand={this.onExpand.bind(this)}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                >
                    {loop(gData)}
                </Tree>
            </div>
        );
    }
}

export default Title