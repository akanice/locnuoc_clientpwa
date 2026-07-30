import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useImportBatches } from '@/features/profile/hooks/useImportBatches';
import {
  useUpdateUserSettings,
  useUserSettings,
} from '@/features/profile/hooks/useUserSettings';
import {
  PACKAGE_FILTER_OPTIONS,
  PACKAGE_FILTER_TAG,
  PACKAGE_FILTER_TITLE,
  getBatchesByPackageName,
  getPackageNameOptions,
  type ImportBatch,
  type PackageFilterType,
} from '@/features/profile/services/import-batch.service';

interface ReceiveDataSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const selectClassName =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 transition-colors duration-150 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100';

function restorePackageSelection(
  batches: ImportBatch[],
  importBatchIds: number[],
): {
  filterType: PackageFilterType | '';
  packageName: string;
  importBatchIds: number[];
} {
  if (importBatchIds.length === 0 || batches.length === 0) {
    return { filterType: '', packageName: '', importBatchIds: [] };
  }

  const firstBatch = batches.find((batch) => batch.id === importBatchIds[0]);
  if (!firstBatch) {
    return { filterType: '', packageName: '', importBatchIds: importBatchIds.slice(0, 1) };
  }

  const title = firstBatch.title?.trim();
  if (title) {
    const byTitle = getBatchesByPackageName(batches, PACKAGE_FILTER_TITLE, title);
    if (byTitle.length > 0) {
      return {
        filterType: PACKAGE_FILTER_TITLE,
        packageName: title,
        importBatchIds: byTitle.map((batch) => batch.id),
      };
    }
  }

  const tag = firstBatch.tags?.find((item) => item?.trim())?.trim();
  if (tag) {
    const byTag = getBatchesByPackageName(batches, PACKAGE_FILTER_TAG, tag);
    if (byTag.length > 0) {
      return {
        filterType: PACKAGE_FILTER_TAG,
        packageName: tag,
        importBatchIds: byTag.map((batch) => batch.id),
      };
    }
  }

  return { filterType: '', packageName: '', importBatchIds: importBatchIds.slice(0, 1) };
}

export function ReceiveDataSettingsModal({ open, onClose }: ReceiveDataSettingsModalProps) {
  const [filterType, setFilterType] = useState<PackageFilterType | ''>('');
  const [packageName, setPackageName] = useState('');
  const [maxAssignQuantity, setMaxAssignQuantity] = useState('');
  const [importBatchIds, setImportBatchIds] = useState<number[]>([]);

  const {
    data: batches = [],
    isLoading: isBatchesLoading,
    isError: isBatchesError,
  } = useImportBatches({ enabled: open });

  const {
    data: settings,
    isError: isSettingsError,
  } = useUserSettings({ enabled: open });

  const updateUserSettings = useUpdateUserSettings();

  const packageNameOptions = useMemo(
    () => getPackageNameOptions(batches, filterType),
    [batches, filterType],
  );

  useEffect(() => {
    if (!open) return;

    if (!settings) {
      setFilterType('');
      setPackageName('');
      setMaxAssignQuantity('');
      setImportBatchIds([]);
      return;
    }

    setMaxAssignQuantity(
      settings.max_assign_quantity != null ? String(settings.max_assign_quantity) : '',
    );

    const restored = restorePackageSelection(batches, settings.import_batch_ids);
    setFilterType(restored.filterType);
    setPackageName(restored.packageName);
    setImportBatchIds(restored.importBatchIds);
  }, [open, settings, batches]);

  const handleFilterTypeChange = (value: PackageFilterType | '') => {
    setFilterType(value);
    setPackageName('');
    setImportBatchIds([]);
  };

  const handlePackageNameChange = (value: string) => {
    setPackageName(value);

    if (!value) {
      setImportBatchIds([]);
      return;
    }

    setImportBatchIds(
      getBatchesByPackageName(batches, filterType, value).map((batch) => batch.id),
    );
  };

  const handleClose = () => {
    onClose();
  };

  const parsedMaxAssignQuantity = Number(maxAssignQuantity);
  const canConfirm =
    Number.isFinite(parsedMaxAssignQuantity) &&
    parsedMaxAssignQuantity > 0 &&
    importBatchIds.length > 0 &&
    !updateUserSettings.isPending;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canConfirm) return;

    updateUserSettings.mutate(
      {
        max_assign_quantity: parsedMaxAssignQuantity,
        import_batch_ids: importBatchIds,
      },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  return (
    <Modal open={open} title="Cài đặt data sẽ nhận" onClose={handleClose}>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="receive-filter-type" className="mb-1.5 block text-sm font-medium">
            Chọn gói dữ liệu
          </label>
          <select
            id="receive-filter-type"
            value={filterType}
            onChange={(event) =>
              handleFilterTypeChange(event.target.value as PackageFilterType | '')
            }
            className={selectClassName}
          >
            <option value="">Chọn loại gói</option>
            {PACKAGE_FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="receive-package-name" className="mb-1.5 block text-sm font-medium">
            Tên gói dữ liệu
          </label>
          <select
            id="receive-package-name"
            value={packageName}
            onChange={(event) => handlePackageNameChange(event.target.value)}
            disabled={!filterType || isBatchesLoading}
            className={`${selectClassName} disabled:cursor-not-allowed disabled:opacity-60`}
          >
            <option value="">
              {isBatchesLoading
                ? 'Đang tải...'
                : !filterType
                  ? 'Chọn gói dữ liệu trước'
                  : packageNameOptions.length === 0
                    ? 'Không có dữ liệu'
                    : 'Chọn tên gói'}
            </option>
            {packageNameOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-[13px] text-slate-500 dark:text-slate-400">
            Mỗi lần chỉ chọn một gói dữ liệu. Chọn gói mới sẽ thay thế gói hiện tại.
          </span>
          {isBatchesError && (
            <span className="mt-1 block text-[13px] text-danger">
              Không thể tải danh sách gói dữ liệu
            </span>
          )}
        </div>

        {packageName && importBatchIds.length > 0 && (
          <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 dark:border-primary/25 dark:bg-primary/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Gói đang chọn
            </p>
            <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
              {packageName}
            </p>
          </div>
        )}

        <Input
          id="receive-max-assign-quantity"
          label="Số data tối đa nhận được"
          type="number"
          min={1}
          inputMode="numeric"
          placeholder="Nhập số data tối đa"
          value={maxAssignQuantity}
          onChange={(event) => setMaxAssignQuantity(event.target.value)}
        />
        {isSettingsError && (
          <span className="mt-1 block text-[13px] text-danger">
            Không thể tải cài đặt hiện tại
          </span>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button type="submit" loading={updateUserSettings.isPending} disabled={!canConfirm}>
            Xác nhận
          </Button>
        </div>
      </form>
    </Modal>
  );
}
