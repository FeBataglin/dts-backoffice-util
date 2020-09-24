// tslint:disable: variable-name
// tslint:disable: no-input-rename
// tslint:disable: no-output-rename
import { Input, EventEmitter, Output, Directive } from '@angular/core';
import { DtsKendoGridColumn, DtsEditAction } from './dts-kendo-grid-column.interface';

/**
 * @description
 *
 * O componente `dts-kendo-grid` é utilizado para desenvolver tabelas mais complexas como as funcionalidades
 * de classificação de dados, adição e remoção de linhas e edição de dados *"in line"*.
 *
 * **Boas práticas:**
 *
 * - Importe o `DtsKendoModule` apenas nos módulos em que ele será realmente utilizado.
 *
 * **Utilização:**
 *
 * Realize a instalação do *package* `@totvs/dts-kendo` em sua aplicação.
 *
 * ```
 * npm i --save @totvs/dts-kendo
 * ```
 *
 * Adicione o módulo `DtsKendoModule` em seu projeto.
 *
 * > Para o correto funcionamento do DTS Grid, deve ser importado o módulo `BrowserAnimationsModule` no módulo principal da sua aplicação.
 *
 * ```
 * import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 *
 * import { DtsKendoModule } from '@totvs/dts-kendo';
 * ...
 *
 * @NgModule({
 *   imports: [
 *     BrowserModule,
 *     BrowserAnimationsModule,
 *     ...
 *     DtsKendoModule,
 *     ...
 *   ],
 *   declarations: [
 *     AppComponent
 *   ],
 *   providers: [],
 *   bootstrap: [AppComponent]
 * })
 * export class AppModule { }
 * ```
 *
 * No arquivo `angular.json` da sua aplicação você deve importar o arquivo `all.css` que contém o tema padrão do `kendo-grid` e
 * o arquivo `dts-theme-default.min.css` com as personalizações do `DTS`.
 *
 * ```
 * ...
 * "styles": [
 *   "node_modules/@progress/kendo-theme-default/dist/all.css",
 *   "node_modules/@totvs/dts-theme/css/dts-theme-default.min.css"
 * ]
 * ...
 * ```
 *
 * > É importante seguir essa ordem para que o tema padrão do `kendo-grid` seja sobreposto pelo tema personalizado do `DTS`.
 */
@Directive()
export abstract class DtsKendoGridBaseComponent {

    /** Habilita a opção de ordenação dos dados nas colunas. */
    @Input('d-sortable') set sortable(sortable: boolean) {
        this._sortable = sortable != null && sortable.toString() === '' ? true : this.convertToBoolean(sortable);
    }
    get sortable() {
        return this._sortable;
    }

    /** Habilita a opção de selecionar uma linha do dts-kendo-grid. */
    @Input('d-selectable') set selectable(selectable: boolean) {
        this._selectable = selectable != null && selectable.toString() === '' ? true : this.convertToBoolean(selectable);
    }
    get selectable() {
        return this._selectable;
    }

    /** Habilita o botão para edição da linha. */
    @Input('d-editable') set editable(editable: boolean) {
        this._editable = editable != null && editable.toString() === '' ? true : this.convertToBoolean(editable);
    }
    get editable() {
        return this._editable;
    }

    /** Habilita a opção para agrupamento, permitindo agrupar no máximo dois níveis. */
    @Input('d-groupable') set groupable(groupable: boolean) {
        this._groupable = groupable != null && groupable.toString() === '' ? true : this.convertToBoolean(groupable);
        if (!this._groupable) {
            this.cleanGroups();
        }
    }
    get groupable() {
        return this._groupable;
    }

    private _sortable: boolean;

    private _selectable: boolean;

    private _editable: boolean;

    private _groupable: boolean;

    public columns: Array<DtsKendoGridColumn>;

    /** Lista de objeto a serem exibidos. Este atributo aceita um array de objetos JSON. */
    @Input('d-data') data: Array<any>;

    /** Objeto com as informações das colunas a serem exibidas. */
    //   @Input('d-columns') _columns: Array<DtsKendoGridColumn>;

    @Input('d-columns') set dColumns(columns: Array<DtsKendoGridColumn>) {
        this.columns = columns ? JSON.parse(JSON.stringify(columns)) : [];
        this.initializeColumns();
    }

    @Input('d-groups') groups: any;

    /** Recebe valores "true" ou "false" para habilitar ou desabilitar o botão "Carregar Mais Resultados". */
    @Input('d-show-more-disabled') showMoreDisabled = 'false';

    /** Habilita o botão para adicionar linhas. */
    @Input('d-show-add-button') addButton = false;

    /**
     * Objeto com as Funções que serão disparadas Antes da Inclusão e Antes de Salvar a linha na editada.
     * Estes funções receberão como parâmetro o atributo "event",
     * para acessar o objeto selecionado no dts-kendo-grid utilizando o "event.data".
     * Se o método retornar o valor booleano "true", a edição da linha é confirmada,
     * caso contrário as informações alteradas serão canceladas.
     */
    @Input('d-edit-actions') editActions?: DtsEditAction;

    /**
     * Objeto com as literais que serão utilizadas para as mensagens de:
     * noRecords: Nenhum registro encontrado
     * groupPanelEmpty: Arraste a coluna até o cabeçalho e solte para agrupar por esta coluna
     * add: Adicionar
     * remove: Remover
     * showMore: Carregar mais resultados
     * cancel: Cancelar
     * undo: Descartar
     *
     */
    @Input('d-literals') literals: any = {};

    @Input('d-filterable') filterable = false;

    /**
     * @optional
     *
     * @description
     *
     * Recebe um método para carregar mais resultados e habilita o botão desta opção.
     */
    @Input('d-actions') actions = [];

    @Input('d-reorderable') reorderable = false;

    /** Habilita a opção para exportação dos dados. */
    @Input('d-show-export-buttons') exportButtons = false;

    @Output('d-show-more') showMore = new EventEmitter<any>();

    /**
     * @optional
     *
     * @description
     *
     * Evento de seleção de linha que chama um método do componente. Este atributo é utilizado em conjunto com o atributo "d-selectable".
     */
    @Output('d-selection-change') selectionChange = new EventEmitter<any>();

    /**
     * @optional
     *
     * @description
     *
     * Evento disparado ao salvar dados do modo de edição inline, recebendo o modelo que foi alterado.
     */
    @Output('d-save-value') saveValue = new EventEmitter<any>();

    @Output('d-group-change') dtsGroupChange = new EventEmitter<any>();

    protected clickoutListener: () => void;

    abstract onShowMore(): void;

    abstract onSelectionChange(event: any): void;

    // Limpa os dados do grupo quando o mesmo for desmarcado.
    abstract cleanGroups(): void;

    protected convertToBoolean(val: any): boolean {
        if (typeof val === 'string') {
            val = val.toLowerCase().trim();
            return (val === 'true' || val === 'on' || val === '');
        }

        if (typeof val === 'number') {
            return val === 1;
        }

        return !!val;
    }

    private initializeColumns(): void {
        if (!this.columns) {
            this.columns = [];
        } else {
            this.defineColumnType();
        }
    }

    // // Define a configuração da coluna em modo edição de acordo com o tipo informado.
    private defineColumnType() {

        const lookupTableType = {
            number: column => {
                column.type = 'numeric';
                column.filterType = 'numeric';
                column.editType = 'numeric';
                column.format = column.format ? column.format : '';
                column.editFormat = this.getEditFormat(column.format);
            },
            currency: column => {
                column.type = 'currency';
                column.filterType = 'numeric';
                column.editType = 'numeric';
                column.currency = column.currency ? column.currency : '$';
                column.symbol = column.symbol ? column.symbol : '1.2-2';
                column.editFormat = this.getEditFormat(column.symbol);
            },
            date: column => {
                column.type = 'date';
                column.filterType = 'date';
                column.editType = 'date';
                column.format = column.format && column.format.trim().length > 0 ? `${column.format}` : 'dd/MM/yyyy';
            },
            string: column => {
                column.type = 'text';
                column.filterType = 'text';
                column.editType = 'text';
            },
            label: column => {
                column.type = 'label';
                column.filterType = 'text';
                column.editType = 'text';
            },
            subtitle: column => {
                column.type = 'subtitle';
                column.filterType = 'text';
                column.editType = 'text';
            },
            checkbox: column => {
                column.type = 'checkbox';
                column.filterType = 'boolean';
                column.editType = 'boolean';
            }
        };

        this.columns.forEach(column => {
            if (column.type && lookupTableType.hasOwnProperty(column.type.trim().toLowerCase())) {
                lookupTableType[column.type.trim().toLowerCase()](column);
            } else {
                column.type = 'text';
            }
        });
    }

    private getEditFormat(decimalPipe: string): string {
        if (!decimalPipe) { return 'n0'; }

        let part = decimalPipe.split('.');
        if (part.length < 2) { return 'n0'; }

        part = part[1].split('-');
        if (part.length < 2) { return 'n0'; }

        return `n${part[1]}`;
    }
}
