import { strToU8 } from "fflate";

import { calculateNormal } from "./geometry";
import type { Mesh } from "./types";

function coordinate(value: number): string {
  return Number(value.toFixed(6)).toString();
}

export function meshToAsciiStl(mesh: Mesh): Uint8Array {
  const lines = [`solid ${mesh.name.replace(/\s+/g, "_")}`];

  for (const [aIndex, bIndex, cIndex] of mesh.triangles) {
    const a = mesh.vertices[aIndex];
    const b = mesh.vertices[bIndex];
    const c = mesh.vertices[cIndex];

    if (!a || !b || !c) {
      throw new Error(`Invalid triangle in ${mesh.name}.`);
    }

    const normal = calculateNormal(a, b, c);
    lines.push(
      `  facet normal ${coordinate(normal.x)} ${coordinate(normal.y)} ${coordinate(normal.z)}`,
      "    outer loop",
      `      vertex ${coordinate(a.x)} ${coordinate(a.y)} ${coordinate(a.z)}`,
      `      vertex ${coordinate(b.x)} ${coordinate(b.y)} ${coordinate(b.z)}`,
      `      vertex ${coordinate(c.x)} ${coordinate(c.y)} ${coordinate(c.z)}`,
      "    endloop",
      "  endfacet",
    );
  }

  lines.push(`endsolid ${mesh.name.replace(/\s+/g, "_")}`);
  return strToU8(`${lines.join("\n")}\n`);
}
