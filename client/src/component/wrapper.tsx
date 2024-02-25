export const Wrapper = (props: { children: JSX.Element }) => {
    return <section className="mx-auto py-10 w-wrapper text-wrapper">
        {props.children}
    </section>
}