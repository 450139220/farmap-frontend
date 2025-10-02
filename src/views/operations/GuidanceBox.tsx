import style from "./index.module.css";

export interface Guidance {
  id: number;
  text: string;
  isFormula: boolean;
}
const GuidanceBox = ({
  list,
  type,
  iconClass,
}: {
  list: Guidance[];
  type: string;
  iconClass: string;
}) => {
  // TODO: if <list.length> is 0, the dom will show the 0 on screen
  return (
    <>
      <div className={style.title}>
        <i className={iconClass}></i>
        &nbsp;&nbsp;{type}
      </div>
      <div className={style.content}>
        {list
          .filter((l) => !l.isFormula)
          .map((l) => (
            <div key={l.id}>
              <span>操作建议</span>
              {l.text}
            </div>
          ))}
        {list
          .filter((l) => l.isFormula)
          .map((l) => (
            <div key={l.id}>
              <span>配方推荐</span>
              {l.text}
            </div>
          ))}
      </div>
      <div className="line"></div>
    </>
  );
};

export default GuidanceBox;
