import React, { useEffect, useState } from "react";
import "./tabs.css";

export const Tabs = (props: React.PropsWithChildren) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [tabs, setTabs] = useState<typeof Tab[]>([]);

  useEffect(() => {
    setTabs(props.children as typeof Tab[]);
  }, [setTabs, props.children]);

  if (!Array.isArray(props.children)) {
    throw Error("<Tabs> requires <Tab> components as its children");
  }

  if (props.children?.length === 0) {
    throw Error("<Tabs> requires <Tab> components as it's children");
  }

  // const allTabs = props.children.filter(it => it instanceof Tab)
  // console.log(allTabs.length, props.children.length)
  // if (allTabs.length !== props.children.length) {
  //     debugger
  //     return null
  //     //throw Error("<Tabs> can only have <Tab> components as its direct children")
  // }

  const handleTabClicked = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <div id="tabs">
      <div id="tab-headings">
        {React.Children.map(props.children, (child, index) => {
          const isSelected = index == selectedIndex;
          if (!React.isValidElement<TabProps>(child)) {
            return;
          }
          return (
            <div
              className={isSelected ? "tab-heading active" : "tab-heading"}
              onClick={() => handleTabClicked(index)}
            >
              {child.props.title}
            </div>
          );
        })}
      </div>
      <div id="tab-content">
        {React.Children.map(props.children, (child, i) =>
          React.createElement(TabWrapper, {
            active: selectedIndex === i,
            TabComponent: child,
          })
        )}
      </div>
    </div>
  );
};

interface TabProps extends React.PropsWithChildren {
  title: string;
}

export const Tab: React.FC<TabProps> = ({ children }) => <>{children}</>;

interface TabWrapperProps extends React.PropsWithChildren {
  TabComponent: React.ReactNode;
  active: boolean;
}

export const TabWrapper: React.FC<TabWrapperProps> = ({
  TabComponent,
  active,
}) => {
  return active ? <div data-id="tab">{TabComponent}</div> : null;
};
