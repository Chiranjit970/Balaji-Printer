<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SettingsAuditLog extends Model
{
    protected $table = 'settings_audit_log';

    public $timestamps = false;

    protected $fillable = [
        'admin_id',
        'key',
        'old_value',
        'new_value',
        'changed_at',
    ];

    protected $casts = [
        'changed_at' => 'datetime',
    ];

    /**
     * Get the admin who made the change.
     */
    public function admin()
    {
        return $this->belongsTo(Admin::class, 'admin_id');
    }
}
