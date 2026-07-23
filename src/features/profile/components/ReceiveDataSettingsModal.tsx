import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { HiX } from 'react-icons/hi';
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

function getSelectedBatchOptions(
  batches: ImportBatch[],
  importBatchIds: number[],
): Array<{ id: number; label: string }> {
  return importBatchIds.map((id) => {
    const batch = batches.find((item) => item.id === id);
    return {
      id,
      label: batch?.title?.trim() || `Batch #${id}`,
    };
  });
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
    isLoading: isSettingsLoading,
    isError: isSettingsError,
  } = useUserSettings({ enabled: open });

  const updateUserSettings = useUpdateUserSettings();

  const packageNameOptions = useMemo(
    () => getPackageNameOptions(batches, filterType),
    [batches, filterType],
  );

  const selectedBatchOptions = useMemo(
    () => getSelectedBatchOptions(batches, importBatchIds),
    [batches, importBatchIds],
  );

  useEffect(() => {
    if (!open) return;

    setFilterType('');
    setPackageName('');
  }, [open]);

  useEffect(() => {
    if (!open || !settings) return;

    setMaxAssignQuantity(
      settings.max_assign_quantity != null ? String(settings.max_assign_quantity) : '',
    );
    setImportBatchIds(settings.import_batch_ids);
  }, [open, settings]);

  const handleFilterTypeChange = (value: PackageFilterType | '') => {
    setFilterType(value);
    setPackageName('');
  };

  const handlePackageNameChange = (value: string) => {
    setPackageName(value);

    if (!value) return;

    const matchedIds = getBatchesByPackageName(batches, filterType, value).map(
      (batch) => batch.id,
    );

    setImportBatchIds((prev) => Array.from(new Set([...prev, ...matchedIds])));
  };

  const handleRemoveSelectedBatch = (batchId: number) => {
    setImportBatchIds((prev) => prev.filter((id) => id !== batchId));
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

  const isLoading = isBatchesLoading || isSettingsLoading;

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
          {isBatchesError && (
            <span className="mt-1 block text-[13px] text-danger">
              Không thể tải danh sách gói dữ liệu
            </span>
          )}
        </div>

        <div className="mb-4">
          <span className="mb-1.5 block text-sm font-medium">Data đã chọn</span>
          <div
            className={[
              'overflow-hidden rounded-xl border border-slate-200 dark:border-slate-600',
              isLoading ? 'opacity-60' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {selectedBatchOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                {isLoading ? 'Đang tải...' : 'Chưa chọn data'}
              </div>
            ) : (
              <ul className="max-h-[12rem] overflow-y-auto divide-y divide-slate-200 dark:divide-slate-600">
                {selectedBatchOptions.map((batch) => (
                  <li
                    key={batch.id}
                    className="flex min-h-11 items-center gap-2 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                  >
                    <span className="min-w-0 flex-1 truncate">{batch.label}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSelectedBatch(batch.id)}
                      aria-label={`Xóa ${batch.label}`}
                      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-danger dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-danger"
                    >
                      <HiX size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <span className="mt-1 block text-[13px] text-slate-500 dark:text-slate-400">
            Chọn tên gói để thêm data vào danh sách.
          </span>
          {isSettingsError && (
            <span className="mt-1 block text-[13px] text-danger">
              Không thể tải cài đặt hiện tại
            </span>
          )}
        </div>

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
