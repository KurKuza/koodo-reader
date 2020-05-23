import React from "react";
import "./sidebar.css";
import { handleMode, handleShelfIndex } from "../../redux/actions/sidebar";
import { connect } from "react-redux";
import { sideMenu } from "../../utils/readerConfig";
import ShelfUtil from "../../utils/shelfUtil";
import { stateType } from "../../redux/store";
import { Trans } from "react-i18next";
import { withNamespaces } from "react-i18next";

export interface SidebarProps {
  mode: string;
  handleMode: (mode: string) => void;
  handleShelfIndex: (index: number) => void;
}

export interface SidebarState {
  index: number;
  isCollapse: boolean;
  shelfIndex: number;
}

class Sidebar extends React.Component<SidebarProps, SidebarState> {
  constructor(props: SidebarProps) {
    super(props);
    this.state = {
      index: ["home", "recent", "bookmark", "note", "digest"].indexOf(
        this.props.mode
      ),
      isCollapse: true,
      shelfIndex: -1,
    };
  }
  handleSidebar = (mode: string, index: number) => {
    this.setState({ index: index });
    this.setState({ shelfIndex: -1 });
    this.setState({ isCollapse: true });
    this.props.handleMode(mode);
    this.props.handleShelfIndex(-1);
  };
  handleShelf = () => {
    this.setState({ isCollapse: !this.state.isCollapse });
  };
  handleShelfItem = (index: number) => {
    this.setState({ shelfIndex: index });
    this.props.handleShelfIndex(index);
    this.props.handleMode("shelf");
  };
  render() {
    const renderSideMenu = () => {
      return sideMenu.map((item, index) => {
        return (
          <li
            key={item.name}
            className={
              this.state.index === index && this.state.shelfIndex === -1
                ? "active side-menu-item"
                : "side-menu-item"
            }
            id={`sidebar-${item.icon}`}
            onClick={() => {
              this.handleSidebar(item.mode, index);
            }}
          >
            {this.state.index === index && this.state.shelfIndex === -1 ? (
              <div className="side-menu-selector-container"></div>
            ) : null}
            <div
              className={
                this.state.index === index && this.state.shelfIndex === -1
                  ? "side-menu-selector active-selector"
                  : "side-menu-selector "
              }
            >
              <span
                className={
                  this.state.index === index && this.state.shelfIndex === -1
                    ? `icon-${item.icon} side-menu-icon  active-icon`
                    : `icon-${item.icon} side-menu-icon`
                }
              ></span>
              <Trans>{item.name}</Trans>
            </div>
          </li>
        );
      });
    };
    const renderShelfList = () => {
      const shelfList = Object.keys(ShelfUtil.getShelf());
      //去除开头的新建书架
      shelfList.splice(0, 1);
      return shelfList.map((item, index) => {
        return (
          <li
            key={item}
            className={
              this.state.shelfIndex === index
                ? "shelf-list-item active-shelf "
                : "shelf-list-item"
            }
            onClick={() => {
              this.handleShelfItem(index);
            }}
          >
            <Trans>{item}</Trans>
          </li>
        );
      });
    };
    return (
      <div className="sidebar">
        <img
          src={
            process.env.NODE_ENV === "production"
              ? "assets/logo.png"
              : "../../assets/logo.png"
          }
          alt=""
          className="logo"
        />
        <div className="side-menu-container-parent">
          <ul className="side-menu-container">
            {renderSideMenu()}
            <li className="side-menu-shelf">
              <div
                onClick={() => {
                  this.handleShelf();
                }}
              >
                <span className="icon-shelf"></span>
                <Trans>My Shelves</Trans>
                <span
                  className={
                    this.state.isCollapse ? "icon-dropdown" : "icon-shangla"
                  }
                ></span>
              </div>
              <div className="shelf-list-container-parent">
                <ul
                  className="shelf-list-container"
                  style={this.state.isCollapse ? { display: "none" } : {}}
                >
                  {renderShelfList()}
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state: stateType) => {
  return { mode: state.sidebar.mode };
};
const actionCreator = { handleMode, handleShelfIndex };
export default connect(
  mapStateToProps,
  actionCreator
)(withNamespaces()(Sidebar as any));
