import { Mass } from "./Mass";

export function isColliding(firstObject: Mass, secondObject: Mass) {
  return (
    distanceBetween(firstObject, secondObject) <
    firstObject.radiusValue + secondObject.radiusValue
  );
}

export function distanceBetween(firstObject: Mass, secondObject: Mass) {
  return Math.sqrt(
    Math.pow(firstObject.x - secondObject.x, 2) +
      Math.pow(firstObject.y - secondObject.y, 2)
  );
}
