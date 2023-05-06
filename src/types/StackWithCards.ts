import Card from "./Card";
import Stack from "./Stack";

export default interface StackWithCards extends Stack {
    cards: Card[]
}