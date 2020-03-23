# react-responsive-scrollbox

An util component for react to create a **responsive** scrollable area with **customizable scrollbar**.

### Notification

1. This library is using [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver), check your browser support first.
2. React version should be above **16.8.0**.

### Code demo

[CodeSandbox](https://codesandbox.io/embed/intelligent-raman-hp7hc?fontsize=14&hidenavigation=1&theme=dark)

### Install

```
npm install --save react-responsive-scrollbox
```

### Usage

```jsx
import ScrollBox from "react-responsive-scrollbox";

// Just wrap the content.
<ScrollBox>Your content here.</ScrollBox>;
```

The ScrollBox will responsively take up all the space of its parent element by default (width: 100%, height: 100%). You can change this behavior by adding additional styles:

1. use style prop.

```jsx
<ScrollBox style={{ height: "100px" }}>Your content here.</ScrollBox>
```

2. use CSS class.

```css
.addtional-style {
  width: 200px;
  height: 300px;
}
```

```jsx
<ScrollBox className="addtional-style">Your content here.</ScrollBox>
```

### Style the scrollbar

Every item of the scrollbar in ScrollBox has its own CSS class name, so you can use CSS selector to choose and customize the item you want.

| Item                       | CSS selector                   |
| -------------------------- | ------------------------------ |
| all scrollbar track        | `.scroll-box-track`            |
| vertical scrollbar track   | `.scroll-box-track.vertical`   |
| horizontal scrollbar track | `.scroll-box-track.horizontal` |
| all scrollbar thumb        | `.scroll-box-thumb`            |
| vertical scrollbar thumb   | `.scroll-box-thumb.vertical`   |
| horizontal scrollbar thumb | `.scroll-box-thumb.horizontal` |

For example, if you want to change the background color of vertical scrollbar track to green:

```css
.green-bg .scroll-box-track.vertical {
  background-color: green;
}
```

```jsx
<ScrollBox className="green-bg">Your content here.</ScrollBox>
```
