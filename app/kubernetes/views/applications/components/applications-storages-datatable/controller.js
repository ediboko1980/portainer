import _ from 'lodash-es';

angular.module('portainer.kubernetes').controller('KubernetesApplicationsStoragesDatatableController', [
  '$scope',
  '$controller',
  'KubernetesNamespaceHelper',
  'DatatableService',
  'Authentication',
  function ($scope, $controller, DatatableService) {
    angular.extend(this, $controller('GenericDatatableController', { $scope: $scope }));
    this.state = Object.assign(this.state, {
      expandedItems: [],
      expandAll: false,
    });

    this.onSettingsRepeaterChange = function () {
      DatatableService.setDataTableSettings(this.tableKey, this.settings);
    };

    this.expandItem = function (item, expanded) {
      if (!this.itemCanExpand(item)) {
        return;
      }

      item.Expanded = expanded;
      if (!expanded) {
        item.Highlighted = false;
      }
    };

    this.itemCanExpand = function (item) {
      return item.Volumes.length > 0;
    };

    this.hasExpandableItems = function () {
      return _.filter(this.state.filteredDataSet, (item) => this.itemCanExpand(item)).length;
    };

    this.expandAll = function () {
      this.state.expandAll = !this.state.expandAll;
      _.forEach(this.state.filteredDataSet, (item) => {
        if (this.itemCanExpand(item)) {
          this.expandItem(item, this.state.expandAll);
        }
      });
    };

    this.$onInit = function () {
      this.setDefaults();
      this.prepareTableFromDataset();

      this.state.orderBy = this.orderBy;
      var storedOrder = DatatableService.getDataTableOrder(this.tableKey);
      if (storedOrder !== null) {
        this.state.reverseOrder = storedOrder.reverse;
        this.state.orderBy = storedOrder.orderBy;
      }

      var textFilter = DatatableService.getDataTableTextFilters(this.tableKey);
      if (textFilter !== null) {
        this.state.textFilter = textFilter;
        this.onTextFilterChange();
      }

      var storedFilters = DatatableService.getDataTableFilters(this.tableKey);
      if (storedFilters !== null) {
        this.filters = storedFilters;
      }
      if (this.filters && this.filters.state) {
        this.filters.state.open = false;
      }

      var storedSettings = DatatableService.getDataTableSettings(this.tableKey);
      if (storedSettings !== null) {
        this.settings = storedSettings;
        this.settings.open = false;
      }
      this.onSettingsRepeaterChange();
    };
  },
]);
