export type FilterConditionally<Source, Condition> = Pick<
    Source,
    { [K in keyof Source]: Source[K] extends Condition ? K : never }[keyof Source]
>;

export type ExcludeConditionally<Source, Condition> = Pick<
    Source,
    { [K in keyof Source]: Source[K] extends Condition ? never : K }[keyof Source]
>;
