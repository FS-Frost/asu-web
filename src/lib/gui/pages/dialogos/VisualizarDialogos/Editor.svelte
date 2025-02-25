<script lang="ts">
    import * as asu from "@fs-frost/asu";
    import SubsArea from "../SubsArea.svelte";

    type Props = {
        file: asu.ASSFile;
    };

    let { file = $bindable() }: Props = $props();

    let scriptInfoProps: string[] = $derived([
        ...file.scriptInfo.properties.keys(),
    ]);
</script>

<div class="file-section boxed">
    <div class="section-title">Script Info</div>

    {#each scriptInfoProps as prop}
        <div class="field">
            <label class="label" for="">{prop}</label>
            <div class="control">
                <input
                    class="input"
                    type="text"
                    value={file.scriptInfo.properties.get(prop) ?? ""}
                    readonly
                />
            </div>
        </div>
    {/each}
</div>

<div class="file-section boxed">
    <div class="section-title">Estilos</div>

    {#each file.styles.styles as style}
        <div class="field">
            <label class="label" for="">{style.name}</label>
            <div class="control">
                <input
                    class="input"
                    type="text"
                    value={asu.styleToString(style)}
                    readonly
                />
            </div>
        </div>
    {/each}
</div>

<div class="file-section boxed">
    <div class="section-title">Subtítulos</div>

    <table class="table is-fullwidth is-narrow">
        <thead>
            <tr>
                <th>#</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Contenido</th>
            </tr>
        </thead>
        <tbody>
            {#each file.events.lines as linea, indexLinea}
                <tr>
                    <td>{indexLinea + 1}</td>
                    <td>{asu.timeToString(linea.start)}</td>
                    <td>{asu.timeToString(linea.end)}</td>
                    <td>
                        <SubsArea
                            kind="readonly"
                            rawMode={false}
                            hiddeOptions
                            text={linea.content}
                        ></SubsArea>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    .file-section {
        margin-top: 1rem;
    }

    .section-title {
        font-weight: bold;
        font-size: large;
    }
</style>
