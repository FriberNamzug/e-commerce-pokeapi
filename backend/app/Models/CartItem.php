<?

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    protected $fillable = [
        'id_usuario',
        'id_producto',
        'cantidad'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'id_producto', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
