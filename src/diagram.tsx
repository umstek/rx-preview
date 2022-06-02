import { Canvas, Edge, Label, MarkerArrow, Node, Port } from "reaflow";

export const Flow = () => (
  <Canvas
    maxWidth={800}
    maxHeight={600}
    nodes={[
      {
        id: "1",
        text: "generator",
      },
      {
        id: "2",
        text: "map",
      },
      {
        id: "3",
        text: "map",
      },
    ]}
    edges={[
      {
        id: "1-2",
        from: "1",
        to: "2",
      },
      {
        id: "1-3",
        from: "1",
        to: "3",
      },
    ]}
    node={
      <Node
        style={{ stroke: "#1a192b", fill: "white", strokeWidth: 1 }}
        label={<Label style={{ fill: "black" }} />}
        port={<Port style={{ fill: "blue", stroke: "white" }} rx={10} ry={10} />}
      />
    }
    arrow={<MarkerArrow style={{ fill: "#b1b1b7" }} />}
    edge={<Edge className="edge" />}
  />
);
