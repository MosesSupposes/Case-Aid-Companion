module Stack = {
  type t('a) = array('a);

  let push = (value: 'a, stack: t('a)): t('a) =>
    Array.append(stack, [|value|]);
  let pop = (stack: t('a)) => Array.sub(stack, 0, Array.length(stack) - 1);
};